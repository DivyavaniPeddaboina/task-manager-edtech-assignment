const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// ⭐ SIGNUP VALIDATION
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'teacher').required(),
  teacherId: Joi.when('role', {
    is: 'student',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
});


// ⭐ SIGNUP ROUTE
router.post('/signup', async (req, res) => {

  console.log("📥 SIGNUP Request Body:", req.body);   // DEBUG

  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      console.log("❌ SIGNUP Validation Error:", error.details[0].message); // DEBUG
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password, role, teacherId } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ SIGNUP Existing User Error: Email already registered"); // DEBUG
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = new User({
      email,
      passwordHash,
      role,
      teacherId: role === 'student' ? teacherId : null
    });

    await newUser.save();

    console.log("✅ SIGNUP SUCCESS: User created:", newUser._id); // DEBUG

    res.json({ success: true, message: "User created successfully" });

  } catch (err) {
    console.log("🔥 SIGNUP ERROR:", err);  // THE IMPORTANT PART
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ⭐ LOGIN VALIDATION
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


// ⭐ LOGIN ROUTE
router.post('/login', async (req, res) => {

  console.log("📥 LOGIN Request Body:", req.body); // DEBUG

  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log("❌ LOGIN Validation Error:", error.details[0].message);  // DEBUG
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ LOGIN ERROR: User not found");  // DEBUG
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log("❌ LOGIN ERROR: Incorrect password");  // DEBUG
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    console.log("✅ LOGIN SUCCESS:", user._id); // DEBUG

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id
    });

  } catch (err) {
    console.log("🔥 LOGIN ERROR:", err);  // DEBUG
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;