const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth');
require('./passport');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Auth service started on port 3000');
});
