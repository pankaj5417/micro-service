const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock Database
const products = [
    { id: 1, name: 'Laptop', price: 1000, quantity: 10 },
    { id: 2, name: 'Phone', price: 500, quantity: 20 },
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:productId', (req, res) => {
    const product = products.find(p => p.id == req.params.productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.post('/products/:productId/reduce', (req, res) => {
    const product = products.find(p => p.id == req.params.productId);
    if (product && product.quantity > 0) {
        product.quantity -= 1;
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found or out of stock' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Product service listening on port ${PORT}`);
});
