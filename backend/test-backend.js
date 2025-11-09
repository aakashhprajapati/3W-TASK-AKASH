const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Backend is working!' });
});

app.post('/api/auth/signup', (req, res) => {
  console.log('Signup data:', req.body);
  res.json({ 
    success: true, 
    message: 'Signup successful!',
    user: { id: 1, username: req.body.username, email: req.body.email }
  });
});

app.listen(5000, () => {
  console.log('🚀 Test server running on http://localhost:5000');
});