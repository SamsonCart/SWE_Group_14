// Load environment variables from .env file
require('dotenv').config(); // [dotenv Documentation](https://www.npmjs.com/package/dotenv)
// Import Express.js for creating the server
const express = require('express'); // [Express Documentation](https://expressjs.com/)
// Import CORS for handling Cross-Origin Resource Sharing
const cors = require('cors'); // [CORS Documentation](https://www.npmjs.com/package/cors)
// Import path module for file paths
const path = require('path'); // [Path Documentation](https:/
// Import custom error handling middleware
const errorHandler = require('./middlewares/error');

// Initialize the Express app
const app = express();

// CORS settings - specify allowed origins
const corsOptions = {
  origin: [
    'http://localhost:3001', // Nuxt.js development server (Client,Business portal)
    'http://localhost:5173', // Vue development server (Admin portal)
    'http://localhost:5000' // Additional development server
  ]
};

// Apply CORS settings to the app
app.use(cors(corsOptions));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Import database configuration and connect to the database
require('./config/db');

// Serve static files from the 'uploads' directory
app.use('/api/v1.0.0/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse URL-encoded data and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import and use the route handlers from the routes directory
app.use(process.env.API_PREFIX, require('./routes'));

// Use custom error handling middleware
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(process.env.API_PORT || 80, () => console.log('Server is started'));
