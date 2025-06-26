const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pricingRoutes = require('./routes/pricingRoutes'); 
const cors = require('cors');
dotenv.config(); 
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Pricing API');
});
app.use('/api/pricing',pricingRoutes)

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {  
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });





