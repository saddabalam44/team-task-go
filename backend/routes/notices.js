import express from 'express';
import Notice from '../models/Notice.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const notice = await Notice.findOne().sort({ createdAt: -1 });
    res.json(notice || { message: 'Welcome to TeamTaskGo!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const notice = new Notice({
      message: req.body.message,
      updatedBy: req.user._id
    });
    const savedNotice = await notice.save();
    res.status(201).json(savedNotice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
