const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const router = express.Router();
const authMiddleware = require('./authMiddleware'); // Assume you extract this

router.get('/registered', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('registeredEvents');
  res.json(user.registeredEvents);
});

router.get('/upcoming', authMiddleware, async (req, res) => {
  const now = new Date();
  const upcoming = await Event.find({ dateTime: { $gt: now } }).sort({ dateTime: 1 });
  res.json(upcoming);
});

router.get('/past', authMiddleware, async (req, res) => {
  const now = new Date();
  const past = await Event.find({ dateTime: { $lte: now } }).sort({ dateTime: -1 });
  res.json(past);
});

module.exports = router;