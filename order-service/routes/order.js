const express = require('express');
const Order = require('../models/Order');
const producer = require('../kafka/producer');
const router = express.Router();

router.post('/place', async (req, res) => {
  const { userId, symbol, quantity, price } = req.body;
  try {
    const newOrder = await Order.create({ userId, symbol, quantity, price });
    const payloads = [{ topic: 'orders', messages: JSON.stringify(newOrder) }];
    producer.send(payloads, (err, data) => {
      if (err) return res.status(500).send('Error sending order to Kafka');
      res.status(200).send('Order placed');
    });
  } catch (error) {
    res.status(500).send('Error placing order');
  }
});

module.exports = router;
