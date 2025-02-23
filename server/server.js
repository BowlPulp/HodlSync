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
  origin: "http://localhost:5173",
  credentials: true // Allows cookies in requests
}));


// Connect to the MongoDB database
connectDB();

// Use user routes at a specific endpoint (e.g., /api/users)
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
