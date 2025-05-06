// api/waitlist.js
const dbConnect = require('../utils/dbConnect');
const Waitlist = require('../models/Waitlist');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Connect to database
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }

  // GET request - Return waitlist count
  if (req.method === 'GET') {
    try {
      const count = await Waitlist.countDocuments();
      return res.status(200).json({ success: true, count });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to get waitlist count', error: error.message });
    }
  }

  // POST request - Add new user to waitlist
  if (req.method === 'POST') {
    try {
      const { name, email, instagram, interest } = req.body;

      // Check if email already exists
      const existingUser = await Waitlist.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered on the waitlist' });
      }

      // Create new waitlist entry
      const waitlistEntry = await Waitlist.create({
        name,
        email,
        instagram,
        interest
      });

      // Get updated count
      const count = await Waitlist.countDocuments();

      return res.status(201).json({
        success: true,
        message: 'Successfully added to waitlist',
        data: waitlistEntry,
        count
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages });
      }
      return res.status(500).json({ success: false, message: 'Failed to add to waitlist', error: error.message });
    }
  }

  // Return 405 for all other HTTP methods
  return res.status(405).json({ success: false, message: 'Method not allowed' });
};