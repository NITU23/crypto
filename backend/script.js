// const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Coin = require('./model/coin'); 
const cron = require('node-cron');

const app = express();
app.use(cors());

const fetchAndSaveCoins = async () => {
  try {
    let coin = ['BTC','ETH','USDT','BNB','SOL']; 
    const requestData = {
      codes: coin,
      currency: 'USD',
      sort: 'rank',
      order: 'ascending',
      offset: 0,
      limit: 0,
      meta: false
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eca10fd1-3bf8-4fd2-a696-1fdb73f469b8'
      },
      body: JSON.stringify(requestData)
    };

    const response = await fetch('https://api.livecoinwatch.com/coins/map', requestOptions);
    const result = await response.json();
    const coinsData = result || [];

    for (let coinData of coinsData) {
       
      const newCoin = new Coin({
        code: coinData.code,
        cap: coinData.cap,
        rate: coinData.rate
      });

      await newCoin.save();
    }

    console.log(`[${new Date().toISOString()}] Data saved successfully.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error fetching and saving coins:`, err);
  }
};


cron.schedule('*/5 * * * * *', async () => {
    await fetchAndSaveCoins();
  });

app.get('/', async (req, res) => {
  try {
    const symbol = req.query.coin; 
    const recentEntries = await Coin.find({code: symbol }) 
      .sort({ timestamp: -1 })
      .limit(20);
    res.status(200).json(recentEntries);
  } catch (error) {
    console.error('Error fetching recent entries:', error);
    res.status(500).send('Error fetching recent entries.');
  }
});

const PORT = 500;

app.listen(PORT, async () => {
  try {
    await mongoose.connect('mongodb+srv://nitin:Nitin123@cluster0.wwsnzjl.mongodb.net/');
    console.log('Connected to MongoDB');
    await fetchAndSaveCoins();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});
