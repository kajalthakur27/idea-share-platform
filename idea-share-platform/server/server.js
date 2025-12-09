// Sabse pehle environment variables load karo
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes import karo
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');


const app = express();

//ye har request ke liye run hota hai
app.use(cors()); 
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

// MongoDB se connect karo
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);  // Agar database nahi connect hua to server band kar do
  }
};

connectDB();

// Basic route - server check karne ke liye
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Idea Share Platform API is running!',
    endpoints: {
      auth: '/api/auth',
      ideas: '/api/ideas',
      likes: '/api/likes',
      comments: '/api/comments'
    }
  });
});

// API Routes - yaha sare routes connect kar rahe hain
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// 404 Error handler - agar koi route nahi mila
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server start karo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
});
