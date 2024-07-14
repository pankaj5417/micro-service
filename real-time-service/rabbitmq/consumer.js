const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const Order = require('../models/Order');

mongoose.connect('mongodb://localhost/real-time-service', { useNewUrlParser: true, useUnifiedTopology: true });

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, ch) => {
    if (err) throw err;
    const queue = 'order_updates';
    
    ch.assertQueue(queue, { durable: true });
    ch.consume(queue, msg => {
      const order = JSON.parse(msg.content.toString());
      Order.findByIdAndUpdate(order._id, { status: 'completed' }, err => {
        if (err) console.error('Failed to update order:', err);
        ch.ack(msg);
      });
    }, { noAck: false });
  });
});
