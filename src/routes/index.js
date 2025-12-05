// Main router for MCP Server

const express = require('express');
const timeRoutes = require('./timeRoutes');
const llmRoutes = require('./llmRoutes');
const mcpRoutes = require('./mcpRoutes');

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
router.use('/api/llm', llmRoutes);
router.use('/api/mcp', mcpRoutes);

module.exports = router;