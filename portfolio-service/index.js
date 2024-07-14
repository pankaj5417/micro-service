const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

// Connect to database
connectDB();

app.use(bodyParser.json());

app.use('/portfolio', portfolioRoutes);

app.listen(3001, () => {
  console.log('Portfolio service started on port 3001');
});

