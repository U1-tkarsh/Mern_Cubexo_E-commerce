const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

dotenv.config();
app.use(cors());
connectDB();

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/product', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
// app.use('/api/razorpay', require('./routes/razorpay'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});