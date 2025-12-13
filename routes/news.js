const express = require('express');
const router = express.Router();
const axios = require('axios');
const Search = require('../models/search');

router.get('/', async (req, res) => {
  const searchQuery = 'usd forex economy';
  
  const marketauxResponse = await axios.get(
    `https://api.marketaux.com/v1/news/all?api_token=${process.env.MARKETAUX_API_KEY}&search=${encodeURIComponent(searchQuery)}&language=en&page_size=10`
  );
  
  const articles = marketauxResponse.data.data.map(article => ({
    title: article.title,
    description: article.description,
    url: article.url,
    publishedAt: article.published_at,
    source: article.source || 'Marketaux'
  }));

  const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(5);
  
  res.render('news', {
    articles: articles,
    searchQuery: searchQuery,
    recentSearches: recentSearches,
    error: null
  });
});

router.post('/', async (req, res) => {
  const searchQuery = req.body.search || 'usd forex economy';
  
  await Search.create({ query: searchQuery });
  
  const marketauxResponse = await axios.get(
    `https://api.marketaux.com/v1/news/all?api_token=${process.env.MARKETAUX_API_KEY}&search=${encodeURIComponent(searchQuery)}&language=en&page_size=10`
  );
  
  const articles = marketauxResponse.data.data.map(article => ({
    title: article.title,
    description: article.description,
    url: article.url,
    publishedAt: article.published_at,
    source: article.source || 'Marketaux'
  }));

  const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(5);
  
  res.render('news', {
    articles: articles,
    searchQuery: searchQuery,
    recentSearches: recentSearches,
    error: null
  });
});

module.exports = router;