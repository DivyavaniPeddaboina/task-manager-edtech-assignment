const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const Joi = require('joi');

// Validation schema for creating/updating tasks
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  dueDate: Joi.date().optional(),
  progress: Joi.string().valid('not-started', 'in-progress', 'completed').optional()
});


// ⭐ GET ALL TASKS (Teacher/Student with role-based control)
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user;

    // 🔹 If STUDENT → only see own tasks
    if (user.role === 'student') {
      const tasks = await Task.find({ userId: user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, tasks });
    }

    // 🔹 If TEACHER → see own tasks + tasks of assigned students
    if (user.role === 'teacher') {
      const students = await User.find({ teacherId: user._id }).select('_id');
      const studentIds = students.map(s => s._id);

      const tasks = await Task.find({
        $or: [
          { userId: user._id },         // teacher's own tasks
          { userId: { $in: studentIds } } // student tasks
        ]
      }).sort({ createdAt: -1 });

      return res.json({ success: true, tasks });
    }

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ⭐ CREATE TASK (Only the logged-in user)
router.post('/', auth, async (req, res) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const newTask = new Task({
      ...req.body,
      userId: req.user._id   // logged-in user owns the task
    });

    await newTask.save();

    return res.json({ success: true, task: newTask });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ⭐ UPDATE TASK (Only task owner can update)
router.put('/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Permission check — ONLY owner can update
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this task' });
    }

    // Update now
    Object.assign(task, req.body);
    await task.save();

    return res.json({ success: true, task });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ⭐ DELETE TASK (Only task owner can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Only owner can delete
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    return res.json({ success: true, message: 'Task deleted successfully' });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;