const mongoose = require('mongoose');

// User ka schema - yaha define karte hain user ke paas kya kya info hogi
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // required matlab ye field honi hi chahiye
    trim: true       // extra spaces hata deta hai
  },
  email: {
    type: String,
    required: true,
    unique: true,    // unique matlab ek email sirf ek baar use ho sakta hai
    lowercase: true  // email ko lowercase me convert kar deta hai
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true   // automatically createdAt aur updatedAt add kar deta hai
});

// Model export kar rahe hain taaki dusri files me use kar sake
module.exports = mongoose.model('User', userSchema);
