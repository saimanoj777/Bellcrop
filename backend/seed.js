const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const sampleEvents = [
  {
    name: 'Tech Conference 2024',
    organizer: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    dateTime: new Date('2026-06-15T09:00:00'), // Future date
    description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
    capacity: 500,
    availableSeats: 500,
    category: 'Technology',
    tags: ['tech', 'conference', 'ai', 'innovation']
  },
  {
    name: 'Music Festival',
    organizer: 'Harmony Events',
    location: 'Austin, TX',
    dateTime: new Date('2026-07-20T12:00:00'), // Future date
    description: 'Multi-day music festival featuring top artists from various genres including rock, pop, and electronic music.',
    capacity: 10000,
    availableSeats: 10000,
    category: 'Music',
    tags: ['music', 'festival', 'concert', 'rock']
  },
  {
    name: 'Business Workshop',
    organizer: 'Leadership Academy',
    location: 'New York, NY',
    dateTime: new Date('2025-05-10T10:00:00'), // Future date
    description: 'Intensive workshop on business leadership, strategy, and innovation for professionals.',
    capacity: 150,
    availableSeats: 150,
    category: 'Business',
    tags: ['business', 'workshop', 'leadership', 'professional']
  },
  {
    name: 'Art Exhibition Opening',
    organizer: 'Modern Art Gallery',
    location: 'Chicago, IL',
    dateTime: new Date('2024-04-25T18:00:00'), // Past date
    description: 'Opening night of our spring exhibition featuring contemporary art from emerging artists.',
    capacity: 200,
    availableSeats: 200,
    category: 'Arts',
    tags: ['art', 'exhibition', 'gallery', 'contemporary']
  },
  {
    name: 'Food & Wine Tasting',
    organizer: 'Gourmet Society',
    location: 'Napa Valley, CA',
    dateTime: new Date('2024-08-05T15:00:00'), // Past date
    description: 'Exclusive tasting event featuring premium wines paired with gourmet cuisine.',
    capacity: 80,
    availableSeats: 80,
    category: 'Food',
    tags: ['food', 'wine', 'tasting', 'gourmet']
  },
  {
    name: 'Summer Tech Meetup',
    organizer: 'Local Developers',
    location: 'Seattle, WA',
    dateTime: new Date('2024-07-15T14:00:00'), // Past date
    description: 'Monthly meetup for tech enthusiasts to network and share ideas.',
    capacity: 50,
    availableSeats: 50,
    category: 'Technology',
    tags: ['tech', 'meetup', 'networking', 'local']
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log('Sample events added successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();