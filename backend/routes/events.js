const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all events (with search and filters)
router.get('/', async (req, res) => {
  const { search, date, location, category, tags } = req.query;
  let query = {};
  if (search) query.$text = { $search: search };
  if (date) query.dateTime = { $gte: new Date(date) };
  if (location) query.location = { $regex: location, $options: 'i' };
  if (category) query.category = category;
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tagArray };
  }
  const events = await Event.find(query).sort({ dateTime: 1 });
  res.json(events);
});

// Get event details
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// Register for event (protected)
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.registeredEvents.includes(event._id)) return res.status(400).json({ message: 'Already registered' });

    event.availableSeats -= 1;
    event.registeredUsers.push(user._id);
    user.registeredEvents.push(event._id);
    await event.save();
    await user.save();
    
    res.json({ message: 'Registered', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel registration (protected)
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.userId);
    
    if (!event || !user) return res.status(404).json({ message: 'Event or user not found' });
    
    if (!user.registeredEvents.includes(event._id)) return res.status(400).json({ message: 'Not registered' });

    event.availableSeats += 1;
    event.registeredUsers = event.registeredUsers.filter(id => id.toString() !== user._id.toString());
    user.registeredEvents = user.registeredEvents.filter(id => id.toString() !== event._id.toString());
    await event.save();
    await user.save();
    
    res.json({ message: 'Cancelled', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;