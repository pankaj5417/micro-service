const express = require('express');
const Portfolio = require('../models/Portfolio');
const router = express.Router();

router.post('/add', (req, res) => {
  const { userId, symbol, quantity } = req.body;
  Portfolio.findOne({ userId }, (err, portfolio) => {
    if (err) return res.status(500).send('Error finding portfolio');
    if (!portfolio) {
      const newPortfolio = new Portfolio({ userId, stocks: [{ symbol, quantity }] });
      newPortfolio.save(err => {
        if (err) return res.status(500).send('Error saving portfolio');
        res.status(200).send('Stock added');
      });
    } else {
      portfolio.stocks.push({ symbol, quantity });
      portfolio.save(err => {
        if (err) return res.status(500).send('Error updating portfolio');
        res.status(200).send('Stock added');
      });
    }
  });
});

module.exports = router;
