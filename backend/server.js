const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Create text indexes
    require('./models/Event'); // Load the model
    const db = mongoose.connection;
    db.on('connected', () => {
      // Ensure text indexes are created
      db.db.collection('events').createIndex({ name: 'text', description: 'text', category: 'text', location: 'text', tags: 'text' })
        .then(() => console.log('Text index created for events'))
        .catch(err => console.log('Index creation error:', err));
    });
  })
  .catch(err => console.log(err));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Bellcrop Backend API'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));