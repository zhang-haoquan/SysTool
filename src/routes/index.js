// Main router for MCP Server

const express = require('express');
const timeRoutes = require('./timeRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MCP Server'
  });
});

// Register route modules
router.use('/api', timeRoutes);

module.exports = router;