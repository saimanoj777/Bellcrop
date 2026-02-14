const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  location: { type: String, required: true },
  dateTime: { type: Date, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Add text index for search functionality
eventSchema.index({ name: 'text', description: 'text', category: 'text', location: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);