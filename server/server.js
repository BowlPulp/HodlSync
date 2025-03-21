require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require('morgan')
app.use(cookieParser());
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));

app.use(cors({
  origin: process.env.VITE_REACT_APP_FRONTEND_PORT,
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
