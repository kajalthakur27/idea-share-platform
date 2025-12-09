const mongoose = require('mongoose');

// Like ka schema - kon user ne kis idea ko like kiya
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Kis user ne like kiya
    ref: 'User',
    required: true
  },
  idea: {
    type: mongoose.Schema.Types.ObjectId,  // Kis idea ko like kiya
    ref: 'Idea',
    required: true
  }
}, {
  timestamps: true
});

// Ek user ek idea ko sirf ek baar hi like kar sake - isliye unique compound index
likeSchema.index({ user: 1, idea: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
