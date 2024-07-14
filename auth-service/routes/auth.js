const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(200).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in');
});

module.exports = router;
