const jwt = require('jsonwebtoken');
require('dotenv').config();

const payload = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

console.log('Generated JWT Token:', token);
