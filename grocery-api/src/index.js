const express = require('express');
const { seedData } = require('./seed/seedData');
const datastore = require('./data/datastore');

// Add CORS middleware
const cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};

// Import routes
const itemsRoutes = require('./routes/items');
const storesRoutes = require('./routes/stores');
const listsRoutes = require('./routes/lists');
const routeRoutes = require('./routes/route');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Grocery API',
    version: '0.1.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/route', routeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // Handle not found errors
  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }
  
  // Default to 500 server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server with seeded data
async function startServer() {
  try {
    // Seed the database
    const { itemCount, storeCount, totalAisles } = await seedData();
    console.log(`Seeded ${itemCount} items across ${storeCount} stores with ${totalAisles} total aisles`);
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Grocery API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export app for testing
module.exports = app;