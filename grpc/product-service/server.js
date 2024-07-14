const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const products = [
  { id: 1, name: 'Product 1', price: 10.0, quantity: 100 },
  { id: 2, name: 'Product 2', price: 20.0, quantity: 200 },
];

function getProduct(call, callback) {
  const product = products.find(p => p.id === call.request.id);
  if (product) {
    callback(null, product);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  }
}

function getProducts(call, callback) {
  callback(null, { products });
}

function reduceStock(call, callback) {
  const product = products.find(p => p.id === call.request.id);
  if (product) {
    if (product.quantity > 0) {
      product.quantity -= 1;
      callback(null, product);
    } else {
      callback({
        code: grpc.status.OUT_OF_RANGE,
        details: 'Out of Stock'
      });
    }
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Not Found'
    });
  }
}

const server = new grpc.Server();
server.addService(productProto.ProductService.service, { getProduct, getProducts, reduceStock });

const PORT = process.env.PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Product service listening on port ${port}`);
});
