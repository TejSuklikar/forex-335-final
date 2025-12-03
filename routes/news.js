const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /news - Display general USD economic news
router.get('/', async (req, res) => {
  try {
    const searchQuery = 'usd forex economy';
    let articles = [];
    
    // Try Marketaux API first (if MARKETAUX_API_KEY is set)
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
    
    // Fallback to GNews API if Marketaux fails or if GNEWS_API_KEY is set
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
    
    // Fallback to NewsAPI if both fail
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
    
    res.render('news', {
      articles: articles,
      searchQuery: searchQuery,
      error: articles.length === 0 ? 'No articles found. Please check your API key configuration.' : null
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.render('news', {
      articles: [],
      searchQuery: 'usd forex economy',
      error: 'Failed to fetch news. Please check your API key configuration.'
    });
  }
});

// POST /news - Search news by keyword
router.post('/', async (req, res) => {
  try {
    const searchQuery = req.body.search || 'usd forex economy';
    const NEWS_API_KEY = process.env.MARKETAUX_API_KEY || process.env.GNEWS_API_KEY || process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      return res.render('news', {
        articles: [],
        searchQuery: searchQuery,
        error: 'News API key not configured'
      });
    }
    
    let articles = [];
    
    // Try Marketaux API first
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
    
    // Fallback to GNews API
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
    
    // Fallback to NewsAPI
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
    
    res.render('news', {
      articles: articles,
      searchQuery: searchQuery,
      error: articles.length === 0 ? 'No articles found for your search query.' : null
    });
  } catch (error) {
    console.error('Error searching news:', error);
    res.render('news', {
      articles: [],
      searchQuery: req.body.search || 'usd forex economy',
      error: 'Failed to search news. Please try again.'
    });
  }
});

module.exports = router;

