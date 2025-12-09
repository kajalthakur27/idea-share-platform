const mongoose = require('mongoose');

// Idea ka schema - ek idea me kya kya hoga
const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],   // Array of strings - multiple tags ho sakte hain
    default: []
  },
  category: {
    type: String,
    default: 'General'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // User ka reference - kis user ne idea add kiya
    ref: 'User',     // User model se link hai
    required: true
  },
  userName: {
    type: String,    // User ka naam save kar rahe hain taaki bar bar query na karni pade
    required: true
  },
  likesCount: {
    type: Number,
    default: 0       // Shuru me 0 likes honge
  },
  commentsCount: {
    type: Number,
    default: 0       // Shuru me 0 comments honge
  }
}, {
  timestamps: true   // createdAt aur updatedAt automatically add ho jayega
});

module.exports = mongoose.model('Idea', ideaSchema);
