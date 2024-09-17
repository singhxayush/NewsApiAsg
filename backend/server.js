process.removeAllListeners('warning');
const util = require('util');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return;
  }
  console.warn(util.inspect(warning));
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const articleRoutes = require('./articleRoutes');

const app = express();

// app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/', articleRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`News Aggregator server running at http://localhost:${port}`);
  });
}

// Export the Express app
module.exports = app;