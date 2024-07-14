const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Mock Database
const orders = [];

const PRODUCT_SERVICE_URL = 'http://product-service:5001';

app.post('/orders', async (req, res) => {
    const { productId, userId } = req.body;
    
    try {
        const response = await axios.post(`${PRODUCT_SERVICE_URL}/products/${productId}/reduce`);
        const product = response.data;
        console.log("listing products--------->>>",product)
        
        const order = { id: orders.length + 1, userId, productId };
        orders.push(order);
        
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: 'Product not available' });
    }
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Order service listening on port ${PORT}`);
});
