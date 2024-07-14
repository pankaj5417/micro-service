const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stocks: [{ symbol: String, quantity: Number }],
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);
module.exports = Portfolio;
