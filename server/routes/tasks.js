const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");     // ⭐ FIXED (missing import!)
const auth = require("../middleware/auth");


// ⭐ CREATE TASK (ONLY TEACHER)
router.post("/", auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can create tasks."
      });
    }

    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      teacherId: user.id,   // ⭐ IMPORTANT: LINK TASK TO TEACHER
      progress: "not-started"
    });

    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    console.log("TASK CREATE ERROR:", err);
    res.status(500).json({ success: false, message: "Task creation failed" });
  }
});


// ⭐ GET TASKS (teacher → own tasks, student → teacher’s tasks)
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role === "teacher") {
      // Teacher sees ONLY tasks created by them
      const tasks = await Task.find({ teacherId: user._id });
      return res.json({ success: true, tasks });
    }

    if (user.role === "student") {
      if (!user.teacherId) {
        return res.json({ success: true, tasks: [] });
      }

      // Student sees ONLY their teacher's tasks
      const tasks = await Task.find({ teacherId: user.teacherId });
      return res.json({ success: true, tasks });
    }

    res.json({ success: true, tasks: [] });
  } catch (err) {
    console.log("TASK FETCH ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ⭐ UPDATE TASK (ONLY TEACHER)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Student updating progress
    if (req.user.role === "student") {
      task.progress = req.body.progress;
      await task.save();
      return res.json({ success: true, message: "Progress updated", task });
    }

    // Teacher updating their own task (optional)
    if (req.user.role === "teacher" && task.teacherId.toString() === req.user.id) {
      Object.assign(task, req.body);
      await task.save();
      return res.json({ success: true, message: "Task updated", task });
    }

    return res.status(403).json({ success: false, message: "Not allowed" });

  } catch (error) {
    console.log("🔥 UPDATE TASK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ⭐ DELETE TASK (ONLY TEACHER)
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id    // ⭐ FIXED
    });

    if (!deleted)
      return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task deleted successfully" });

  } catch (error) {
    console.log("DELETE TASK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;