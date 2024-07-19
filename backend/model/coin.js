const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  code: String,
  cap: String,
  rate: Number,
  timestamp: { type: Date, default: Date.now } 
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
