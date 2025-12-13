const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const FIXER_API_KEY = process.env.FIXER_API_KEY;
  
  const fixerResponse = await axios.get(
    `https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=USD,EUR,GBP,JPY,CNY,INR`
  );

  const fixerRates = fixerResponse.data.rates;
  const usdRate = fixerRates.USD;
  
  const rates = {
    EUR: fixerRates.EUR / usdRate,
    GBP: fixerRates.GBP / usdRate,
    JPY: fixerRates.JPY / usdRate,
    CNY: fixerRates.CNY / usdRate,
    INR: fixerRates.INR / usdRate
  };

  res.render('index', {
    error: null,
    rates: rates,
    timestamp: fixerResponse.data.date
  });
});

router.post('/refresh', async (req, res) => {
  const FIXER_API_KEY = process.env.FIXER_API_KEY;
  
  const fixerResponse = await axios.get(
    `https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=USD,EUR,GBP,JPY,CNY,INR`
  );

  const fixerRates = fixerResponse.data.rates;
  const usdRate = fixerRates.USD;
  
  const rates = {
    EUR: fixerRates.EUR / usdRate,
    GBP: fixerRates.GBP / usdRate,
    JPY: fixerRates.JPY / usdRate,
    CNY: fixerRates.CNY / usdRate,
    INR: fixerRates.INR / usdRate
  };

  res.render('index', {
    error: null,
    rates: rates,
    timestamp: fixerResponse.data.date
  });
});

module.exports = router;