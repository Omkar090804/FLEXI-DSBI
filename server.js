const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [];

    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [];

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
