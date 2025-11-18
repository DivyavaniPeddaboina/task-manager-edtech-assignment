const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');   // ⭐ make sure you have this

// ⭐ SIGNUP VALIDATION
const signupSchema = Joi.object({
  name: Joi.string().min(2).required(),                     // ⭐ NEW
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "teacher").required(),
  teacherId: Joi.when("role", {
    is: "student",
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
});

// ⭐ SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  console.log("📥 SIGNUP BODY:", req.body);

  try {
    const { error } = signupSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.details[0].message });

    const { name, email, password, role, teacherId } = req.body;

    // email check
    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      teacherId: role === "student" ? teacherId : null
    });

    await newUser.save();

    console.log("✅ SIGNUP SUCCESS");
    return res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ⭐ LOGIN VALIDATION
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// ⭐ LOGIN ROUTE
router.post("/login", async (req, res) => {
  console.log("📥 LOGIN BODY:", req.body);

  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    console.log("✅ LOGIN SUCCESS");

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ⭐ GET ALL TEACHERS (Name + Email)
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id name email");
    res.json({ success: true, teachers });
  } catch (err) {
    console.error("🔥 GET TEACHERS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ⭐ GET ANY USER BY ID (Teacher details)
router.get("/user/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email role");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ⭐ GET LOGGED-IN USER INFO (with teacher populated)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("teacherId", "name email role") // ⭐ THIS GIVES TEACHER NAME
      .select("-passwordHash");

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;