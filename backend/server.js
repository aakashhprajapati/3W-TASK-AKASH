const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// FIXED: Better CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route - FIXED: Added to root route too
app.get('/', (req, res) => {
  res.json({ message: 'Social App Backend is running!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Basic auth routes (temporary - no database needed)
app.post('/api/auth/signup', (req, res) => {
  console.log('📝 Signup request:', req.body);
  
  const { username, email, password } = req.body;
  
  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Simulate successful signup
  res.json({
    success: true,
    token: 'temp-jwt-token-' + Date.now(),
    user: {
      id: Date.now(),
      username: username,
      email: email
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login request:', req.body);
  
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Simulate successful login
  res.json({
    success: true,
    token: 'temp-jwt-token-' + Date.now(),
    user: {
      id: 123,
      username: 'testuser',
      email: email
    }
  });
});

// MongoDB Connection (optional for now)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('⚠️ MongoDB not connected, but server will still work');
    console.log('💡 You can install MongoDB or use MongoDB Atlas later');
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://0.0.0.0:${PORT}`);
  console.log(`✅ Test URL: http://localhost:${PORT}/api/test`);
});