const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET / - Display USD exchange rates
router.get('/', async (req, res) => {
  try {
    // Try Fixer API first if key is provided
    const FIXER_API_KEY = process.env.FIXER_API_KEY;
    let rates = null;
    let timestamp = null;
    
    if (FIXER_API_KEY) {
      try {
        const fixerResponse = await axios.get(
          `https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=USD,EUR,GBP,JPY,CNY,INR`
        );

        if (fixerResponse.data.success !== false && fixerResponse.data.rates) {
          const fixerRates = fixerResponse.data.rates;
          const usdRate = fixerRates.USD;
          
          rates = {
            EUR: fixerRates.EUR / usdRate,
            GBP: fixerRates.GBP / usdRate,
            JPY: fixerRates.JPY / usdRate,
            CNY: fixerRates.CNY / usdRate,
            INR: fixerRates.INR / usdRate
          };
          timestamp = fixerResponse.data.date;
        }
      } catch (fixerError) {
        console.log('Fixer API failed, trying alternative API...');
      }
    }
    
    // Fallback to ExchangeRate-API (free, no key required)
    if (!rates) {
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      
      if (response.data && response.data.rates) {
        const exchangeRates = response.data.rates;
        rates = {
          EUR: exchangeRates.EUR || 0,
          GBP: exchangeRates.GBP || 0,
          JPY: exchangeRates.JPY || 0,
          CNY: exchangeRates.CNY || 0,
          INR: exchangeRates.INR || 0
        };
        timestamp = response.data.date || new Date().toISOString().split('T')[0];
      }
    }

    if (!rates) {
      return res.render('index', {
        error: 'Failed to fetch exchange rates from any API source.',
        rates: null
      });
    }

    res.render('index', {
      error: null,
      rates: rates,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    let errorMessage = 'Failed to fetch exchange rates. Please try again later.';
    
    if (error.response) {
      errorMessage = `API Error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No response from exchange rate API. Please check your internet connection.';
    }
    
    res.render('index', {
      error: errorMessage,
      rates: null
    });
  }
});

// POST /refresh - Refresh exchange rates
router.post('/refresh', async (req, res) => {
  try {
    // Try Fixer API first if key is provided
    const FIXER_API_KEY = process.env.FIXER_API_KEY;
    let rates = null;
    let timestamp = null;
    
    if (FIXER_API_KEY) {
      try {
        const fixerResponse = await axios.get(
          `https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=USD,EUR,GBP,JPY,CNY,INR`
        );

        if (fixerResponse.data.success !== false && fixerResponse.data.rates) {
          const fixerRates = fixerResponse.data.rates;
          const usdRate = fixerRates.USD;
          
          rates = {
            EUR: fixerRates.EUR / usdRate,
            GBP: fixerRates.GBP / usdRate,
            JPY: fixerRates.JPY / usdRate,
            CNY: fixerRates.CNY / usdRate,
            INR: fixerRates.INR / usdRate
          };
          timestamp = fixerResponse.data.date;
        }
      } catch (fixerError) {
        console.log('Fixer API failed, trying alternative API...');
      }
    }
    
    // Fallback to ExchangeRate-API (free, no key required)
    if (!rates) {
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      
      if (response.data && response.data.rates) {
        const exchangeRates = response.data.rates;
        rates = {
          EUR: exchangeRates.EUR || 0,
          GBP: exchangeRates.GBP || 0,
          JPY: exchangeRates.JPY || 0,
          CNY: exchangeRates.CNY || 0,
          INR: exchangeRates.INR || 0
        };
        timestamp = response.data.date || new Date().toISOString().split('T')[0];
      }
    }

    if (!rates) {
      return res.render('index', {
        error: 'Failed to refresh exchange rates from any API source.',
        rates: null
      });
    }

    res.render('index', {
      error: null,
      rates: rates,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Error refreshing exchange rates:', error);
    
    let errorMessage = 'Failed to refresh exchange rates. Please try again later.';
    
    if (error.response) {
      errorMessage = `API Error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No response from exchange rate API. Please check your internet connection.';
    }
    
    res.render('index', {
      error: errorMessage,
      rates: null
    });
  }
});

module.exports = router;

