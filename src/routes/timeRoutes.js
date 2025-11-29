// Time routes for MCP Server

const express = require('express');
const TimeController = require('../controllers/timeController');

const router = express.Router();
const timeController = new TimeController();

/**
 * @route GET /api/time
 * @group Time - Time operations
 * @param {string} format.query - Response format (timestamp|formatted|both)
 * @returns {object} 200 - Time information
 * @returns {object} 400 - Invalid format error
 * @returns {object} 500 - Server error
 */
router.get('/time', (req, res) => timeController.getTime(req, res));

module.exports = router;