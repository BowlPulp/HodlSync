// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Field for tracking multiple crypto addresses. Defaults to an empty array.
  addressesToTrack: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('User', UserSchema);
