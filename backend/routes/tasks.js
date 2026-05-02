import express from 'express';
import Task from '../models/Task.js';
import { protect, adminOnly } from '../middleware/auth.js';

import Project from '../models/Project.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    // Check if the user is an Admin (case-insensitive for robustness)
    if (req.user.role && req.user.role.toLowerCase() === 'admin') {
      tasks = await Task.find().populate('project').populate('assignedTo', 'name email');
    } else {
      // Members only see tasks specifically assigned to them
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

router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Admin can update everything. 
    // Members can ONLY update the status of their OWN tasks.
    const isAdmin = req.user.role && req.user.role.toLowerCase() === 'admin';
    const isAssignedToUser = task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedToUser) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (!isAdmin) {
      // Member can only update status
      if (req.body.title || req.body.description || req.body.project || req.body.assignedTo || req.body.deadline) {
        return res.status(403).json({ message: 'Members can only update task status' });
      }
      
      // Member cannot mark as 'Completed' directly. They must submit for 'In Review'.
      if (req.body.status === 'Completed') {
        req.body.status = 'In Review';
      }
      
      task.status = req.body.status || task.status;
    } else {
      // Admin can update any field
      Object.assign(task, req.body);
    }

    await task.save();

    // If assignedTo or project changed (only possible for Admin), update the project members
    if (isAdmin && (req.body.assignedTo || req.body.project)) {
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
