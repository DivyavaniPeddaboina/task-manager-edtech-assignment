const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  progress: {
    type: String,
    enum: ["not-started", "in-progress", "completed"],
    default: "not-started"
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true   // ⭐ VERY IMPORTANT
  }
});

module.exports = mongoose.model("Task", taskSchema);