const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PROTO_PATH_PRODUCT = path.join(__dirname, '../proto/product.proto');
const packageDefinitionProduct = protoLoader.loadSync(PROTO_PATH_PRODUCT, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinitionProduct).product;

const productClient = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());

const PROTO_PATH_ORDER = path.join(__dirname, '../proto/order.proto');
const packageDefinitionOrder = protoLoader.loadSync(PROTO_PATH_ORDER, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const orderProto = grpc.loadPackageDefinition(packageDefinitionOrder).order;

const orders = [];

function createOrder(call, callback) {
  const { product_id, user_id } = call.request;

  productClient.reduceStock({ id: product_id }, (error, product) => {
    if (error) {
      callback(null, { error: 'Product not available' });
    } else {
      const order = { id: orders.length + 1, user_id, product_id };
      orders.push(order);
      callback(null, order);
    }
  });
}

function getOrders(call, callback) {
  callback(null, { orders });
}

const server = new grpc.Server();
server.addService(orderProto.OrderService.service, { createOrder, getOrders });

const PORT = process.env.PORT || 50052;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Order service listening on port ${port}`);
});

// Express server for handling REST requests
const app = express();
app.use(bodyParser.json());

app.post('/orders', (req, res) => {
  const { product_id, user_id } = req.body;

  const client = new orderProto.OrderService('localhost:50052', grpc.credentials.createInsecure());
  client.createOrder({ product_id, user_id }, (error, response) => {
    if (error || response.error) {
      res.status(400).json({ error: response.error || 'Failed to create order' });
    } else {
      res.status(201).json(response);
    }
  });
});

app.get('/orders', (req, res) => {
  const client = new orderProto.OrderService('localhost:50052', grpc.credentials.createInsecure());
  client.getOrders({}, (error, response) => {
    if (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    } else {
      res.status(200).json(response.orders);
    }
  });
});

app.listen(5002, () => {
  console.log('Order service REST API listening on port 5002');
});
