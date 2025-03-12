// app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");



app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cors({
  origin: "https://www.hodlsync.com",
  credentials: true, // Required for cookies
  allowedHeaders: ["Content-Type", "Authorization"],
}));



// Connect to the MongoDB database
connectDB();

// Use user routes at a specific endpoint (e.g., /api/users)
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}`);
});
