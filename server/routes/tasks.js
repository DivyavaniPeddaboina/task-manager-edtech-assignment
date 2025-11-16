const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// ⭐ CREATE TASK (Teacher or Student — each creates own tasks)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dueDate, progress } = req.body;

    const newTask = new Task({
      userId: req.user.id,
      title,
      description,
      dueDate,
      progress
    });

    await newTask.save();

    return res.json({
      success: true,
      message: "Task created successfully",
      task: newTask
    });

  } catch (error) {
    console.log("🔥 CREATE TASK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ⭐ GET ALL TASKS (Teacher or Student — sees own tasks)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, tasks });

  } catch (error) {
    console.log("🔥 GET TASK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ⭐ UPDATE TASK (Only owner can update)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task updated", task: updated });

  } catch (error) {
    console.log("🔥 UPDATE TASK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ⭐ DELETE TASK (Only owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task deleted successfully" });

  } catch (error) {
    console.log("🔥 DELETE TASK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;