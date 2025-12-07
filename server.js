require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const fxRouter = require('./routes/fx');
const newsRouter = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/forex-insights';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', fxRouter);
app.use('/news', newsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});