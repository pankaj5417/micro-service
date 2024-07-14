const express = require('express');
const mongoose = require('mongoose');
const dataRoutes = require('./routes/data');
const consumer = require('./rabbitmq/consumer');
async function db(){
  await mongoose.connect('mongodb://localhost/real-time-service', { useNewUrlParser: true, useUnifiedTopology: true });

}
db()
const app = express();

app.use('/data', dataRoutes);

app.listen(3003, () => {
  console.log('Real-time data service started on port 3003');
});
