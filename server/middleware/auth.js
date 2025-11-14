const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const header = req.header('Authorization');

    if (!header) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Remove "Bearer " prefix if present
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : header;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;  // attach user object to request
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};