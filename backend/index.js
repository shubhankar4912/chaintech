const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json()); 

// MongoDB connection
const connectionString = process.env.DataBaseURI;

mongoose.connect(connectionString)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

// Registration route
app.post('/api/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    // Create and save new user
    await User.create({ name, phone, email, password });
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    // Check if password is correct
    if (user.password !== password) {
      return res.status(400).send('Invalid credentials');
    }


    res.status(200).send('Login successful');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Profile routes
app.get('/api/profile', async (req, res) => {


    const userId = req.userId; 
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      const { name, phone, email, password } = user;
      res.status(200).json({ name, phone, email, password });
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

app.put('/api/profile', async (req, res) => {
  const { email, name, phone, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.password = password || user.password; 

    await user.save();
    res.status(200).send('Profile updated');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
