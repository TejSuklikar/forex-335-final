const express = require('express');
const router = express.Router();
const axios = require('axios');
const Search = require('../models/search');

router.get('/', async (req, res) => {
  try {
    const searchQuery = 'usd forex economy';
    let articles = [];
    
    if (process.env.MARKETAUX_API_KEY) {
      try {
        const marketauxResponse = await axios.get(
          `https://api.marketaux.com/v1/news/all?api_token=${process.env.MARKETAUX_API_KEY}&search=${encodeURIComponent(searchQuery)}&language=en&page_size=10`
        );
        
        if (marketauxResponse.data && marketauxResponse.data.data) {
          articles = marketauxResponse.data.data.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.published_at,
            source: article.source || 'Marketaux'
          }));
        }
      } catch (marketauxError) {
        console.error('Marketaux API error:', marketauxError.message);
      }
    }
    
    if (articles.length === 0 && process.env.GNEWS_API_KEY) {
      try {
        const gnewsResponse = await axios.get(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&token=${process.env.GNEWS_API_KEY}&lang=en&max=10`
        );
        
        if (gnewsResponse.data.articles) {
          articles = gnewsResponse.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'GNews'
          }));
        }
      } catch (gnewsError) {
        console.error('GNews API error:', gnewsError.message);
      }
    }
    
    if (articles.length === 0 && process.env.NEWS_API_KEY) {
      try {
        const newsApiResponse = await axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${process.env.NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=10`
        );
        
        if (newsApiResponse.data.articles) {
          articles = newsApiResponse.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'NewsAPI'
          }));
        }
      } catch (newsApiError) {
        console.error('NewsAPI error:', newsApiError.message);
      }
    }

    const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(5);
    
    res.render('news', {
      articles: articles,
      searchQuery: searchQuery,
      recentSearches: recentSearches,
      error: articles.length === 0 ? 'No articles found. Please check your API key configuration.' : null
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.render('news', {
      articles: [],
      searchQuery: 'usd forex economy',
      recentSearches: [],
      error: 'Failed to fetch news. Please check your API key configuration.'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const searchQuery = req.body.search || 'usd forex economy';
    
    await Search.create({ query: searchQuery });
    
    const NEWS_API_KEY = process.env.MARKETAUX_API_KEY || process.env.GNEWS_API_KEY || process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(5);
      return res.render('news', {
        articles: [],
        searchQuery: searchQuery,
        recentSearches: recentSearches,
        error: 'News API key not configured'
      });
    }
    
    let articles = [];
    
    if (process.env.MARKETAUX_API_KEY) {
      try {
        const marketauxResponse = await axios.get(
          `https://api.marketaux.com/v1/news/all?api_token=${process.env.MARKETAUX_API_KEY}&search=${encodeURIComponent(searchQuery)}&language=en&page_size=10`
        );
        
        if (marketauxResponse.data && marketauxResponse.data.data) {
          articles = marketauxResponse.data.data.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.published_at,
            source: article.source || 'Marketaux'
          }));
        }
      } catch (marketauxError) {
        console.error('Marketaux API error:', marketauxError.message);
      }
    }
    
    if (articles.length === 0 && process.env.GNEWS_API_KEY) {
      try {
        const gnewsResponse = await axios.get(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&token=${process.env.GNEWS_API_KEY}&lang=en&max=10`
        );
        
        if (gnewsResponse.data.articles) {
          articles = gnewsResponse.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'GNews'
          }));
        }
      } catch (gnewsError) {
        console.error('GNews API error:', gnewsError.message);
      }
    }
    
    if (articles.length === 0 && process.env.NEWS_API_KEY) {
      try {
        const newsApiResponse = await axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${process.env.NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=10`
        );
        
        if (newsApiResponse.data.articles) {
          articles = newsApiResponse.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'NewsAPI'
          }));
        }
      } catch (newsApiError) {
        console.error('NewsAPI error:', newsApiError.message);
      }
    }

    const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(5);
    
    res.render('news', {
      articles: articles,
      searchQuery: searchQuery,
      recentSearches: recentSearches,
      error: articles.length === 0 ? 'No articles found for your search query.' : null
    });
  } catch (error) {
    console.error('Error searching news:', error);
    const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(5);
    res.render('news', {
      articles: [],
      searchQuery: req.body.search || 'usd forex economy',
      recentSearches: recentSearches,
      error: 'Failed to search news. Please try again.'
    });
  }
});

module.exports = router;