// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');

// const productProtoPath = '/proto/product.proto';
// const productPackageDefinition = protoLoader.loadSync(productProtoPath, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });
// const productProto = grpc.loadPackageDefinition(productPackageDefinition).product;

// const client = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());

// client.getProduct({ id: 1 }, (error, response) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('Product:', response);
//   }
// });

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH_ORDER = path.join(__dirname, '../proto/order.proto');
const packageDefinitionOrder = protoLoader.loadSync(PROTO_PATH_ORDER, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const orderProto = grpc.loadPackageDefinition(packageDefinitionOrder).order;

const client = new orderProto.OrderService('localhost:50052', grpc.credentials.createInsecure());

function createOrder(product_id, user_id) {
  client.createOrder({ product_id, user_id }, (error, response) => {
    if (error) {
      console.error('Error creating order:', error);
    } else {
      console.log('Order created successfully:', response);
    }
  });
}

function getOrders() {
  client.getOrders({}, (error, response) => {
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      console.log('Orders:', response.orders);
    }
  });
}

// Example usage:
createOrder(1, 100);
getOrders();

