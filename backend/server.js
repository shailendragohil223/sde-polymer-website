const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Shree Dipeshwari Engineering REST API'
  });
});

// Serve the built React frontend (frontend/dist) so one service hosts the whole app
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 SDE Polymer Node+Express Server running on port ${PORT}`);
    console.log(`📡 API Endpoints available at: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
}

startServer();
