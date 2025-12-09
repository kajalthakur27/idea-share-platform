const mongoose = require('mongoose');

// Comment ka schema - kis user ne kis idea pe kya comment kiya
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Kis user ne comment kiya
    ref: 'User',
    required: true
  },
  userName: {
    type: String,    // User ka naam save kar rahe hain
    required: true
  },
  idea: {
    type: mongoose.Schema.Types.ObjectId,  // Kis idea pe comment kiya
    ref: 'Idea',
    required: true
  }
}, {
  timestamps: true   // Kab comment kiya wo track karne ke liye
});

module.exports = mongoose.model('Comment', commentSchema);
