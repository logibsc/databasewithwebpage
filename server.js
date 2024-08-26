const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/indian_stock_list'; // Update with your MongoDB connection URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Schema and Model
const bseStockSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  currency: String,
  exchange: String,
  mic_code: String,
  country: String,
  type: String
});
const BseStock = mongoose.model('bse_stocks', bseStockSchema);

// Route to fetch stock details by symbol
app.get('/stock', async (req, res) => {
  const { symbol } = req.query;

  try {
    if (!symbol) {
      return res.status(400).send('Symbol parameter is required');
    }

    const stock = await BseStock.findOne({ symbol });
    if (stock) {
      res.json(stock);
    } else {
      res.status(404).send('Stock not found');
    }
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).send('Error fetching stock details');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
