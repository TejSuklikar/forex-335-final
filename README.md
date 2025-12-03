# US Forex Insights

## Project Information

**Submitted by:** <NAME> (<DIRID>)  
**Group Members:** <Name (dirID)>  
**App Description:** A USD-focused forex dashboard using Fixer API + live economic news.  
**YouTube Video Demo Link:** <placeholder>  
**APIs:** Fixer API (https://fixer.io) with fallback to ExchangeRate-API (free), Marketaux API (https://marketaux.com)  
**Contact Email:** <your email>  
**Deployed App Link:** <Render URL>

## Overview

US Forex Insights is a web application that displays live USD exchange rates for major global currencies (EUR, GBP, JPY, CNY, INR) using the Fixer API, along with live economic news headlines that help explain why exchange rates might be moving. The application is built with Node.js, Express.js, EJS templating, and MongoDB (connection only).

## Features

- **Live Exchange Rates**: Real-time USD to major currency conversion rates
- **Economic News**: Searchable economic news feed related to USD and forex markets
- **Clean UI**: Modern, responsive design with Google Font "Inter"
- **Form Search**: Search bar for finding specific economic news topics

## Technology Stack

- **Backend**: Node.js, Express.js
- **Routing**: express.Router()
- **Database**: MongoDB with Mongoose (connection only)
- **Templating**: EJS
- **APIs**: 
  - Fixer API (https://fixer.io) for exchange rates
  - GNews/NewsAPI for economic news
- **Styling**: CSS with Google Font "Inter"

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forex-335-final
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
FIXER_API_KEY=your_fixer_api_key_here
MARKETAUX_API_KEY=your_marketaux_api_key_here
MONGODB_URI=mongodb://localhost:27017/forex-insights
# For production, use your MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forex-insights
```

4. Get API keys (optional):
   - **Fixer API** (optional): Sign up at https://fixer.io and get your API key. If not provided or invalid, the app will use ExchangeRate-API (free, no key required)
   - **Marketaux API**: Sign up at https://marketaux.com and get your API key
   - **Alternative News APIs**: GNews API (https://gnews.io) or NewsAPI (https://newsapi.org) are also supported

## Running Locally

1. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Deployment on Render

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select "Node" as the environment
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables** in Render dashboard:
   - `PORT` (Render sets this automatically, but you can override)
   - `FIXER_API_KEY` - Your Fixer API key
   - `MARKETAUX_API_KEY` - Your Marketaux API key (or GNEWS_API_KEY/NEWS_API_KEY as alternatives)
   - `MONGODB_URI` - Your MongoDB connection string (MongoDB Atlas recommended)

4. **Deploy**: Render will automatically deploy your application

## Project Structure

```
forex-335-final/
│   README.md
│   server.js
│   package.json
│   .env (create this)
│
├── routes/
│   ├── fx.js          # Exchange rates routes
│   └── news.js        # News routes
│
├── views/
│   ├── index.ejs      # Home page (exchange rates)
│   └── news.ejs       # News page
│
└── public/
    └── style.css      # Stylesheet
```

## Routes

- `GET /` - Display USD exchange rates
- `POST /refresh` - Refresh exchange rates manually
- `GET /news` - Display general USD economic news
- `POST /news` - Search news by keyword (form submission)

## Requirements Met

✅ Node.js  
✅ Express.js  
✅ express.Router()  
✅ Mongoose + MongoDB (connection only)  
✅ Form (search bar for news)  
✅ Public CSS file with:
   - background-color
   - color
   - font-size
   - Google Font "Inter"
✅ External API - Fixer API  
✅ Additional API - GNews/NewsAPI  
✅ Render deployment ready  
✅ README.md with all required fields

## Notes

- Exchange rates: The app tries Fixer API first (if key provided), then automatically falls back to ExchangeRate-API (free, no key required) which uses USD as base
- MongoDB connection is established but no CRUD operations are performed (as per requirements)
- The application gracefully handles API errors and missing API keys
- Marketaux API is the primary news source; the app will fall back to GNews or NewsAPI if Marketaux is unavailable

## License

ISC

