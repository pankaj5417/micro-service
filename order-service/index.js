const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/order');

const app = express();

app.use(bodyParser.json());

app.use('/order', orderRoutes);

app.listen(3002, () => {
  console.log('Order service started on port 3002');
});
