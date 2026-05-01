import express from 'express';
import Task from '../models/Task.js';
import { protect, adminOnly } from '../middleware/auth.js';

import Project from '../models/Project.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('project').populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ 
        assignedTo: req.user._id
      }).populate('project').populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();

    // Automatically add the assigned user to the project's members list
    await Project.findByIdAndUpdate(req.body.project, {
      $addToSet: { members: req.body.assignedTo }
    });

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    Object.assign(task, req.body);
    await task.save();

    // If assignedTo or project changed, update the project members
    if (req.body.assignedTo || req.body.project) {
      const projectId = req.body.project || task.project;
      const userId = req.body.assignedTo || task.assignedTo;
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { members: userId }
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
