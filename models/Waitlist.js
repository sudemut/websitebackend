const mongoose = require('mongoose');

const WaitlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    unique: true
  },
  instagram: {
    type: String,
    required: false
  },
  interest: {
    type: String,
    enum: ['ai', 'sustainability', 'social', 'wardrobe', 'all', ''],
    default: ''
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model is already defined to prevent overwriting
module.exports = mongoose.models.Waitlist || mongoose.model('Waitlist', WaitlistSchema);