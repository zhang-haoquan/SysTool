// Unit tests for TimeController

const request = require('supertest');
const express = require('express');
const TimeController = require('../../src/controllers/timeController');
const { errorHandler } = require('../../src/middleware/errorHandler');

// Create a minimal Express app for testing
const app = express();
const timeController = new TimeController();

app.get('/time', (req, res, next) => timeController.getTime(req, res, next));
app.use(errorHandler);

describe('TimeController', () => {
  describe('GET /time', () => {
    it('should return timestamp by default', async () => {
      const response = await request(app).get('/time');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(typeof response.body.data.timestamp).toBe('number');
    }, 10000);

    it('should return timestamp when format=timestamp', async () => {
      const response = await request(app).get('/time?format=timestamp');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).not.toHaveProperty('formatted');
    }, 10000);

    it('should return formatted time when format=formatted', async () => {
      const response = await request(app).get('/time?format=formatted');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('formatted');
      expect(response.body.data).not.toHaveProperty('timestamp');
      expect(typeof response.body.data.formatted).toBe('string');
      expect(response.body.data.formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    }, 10000);

    it('should return both when format=both', async () => {
      const response = await request(app).get('/time?format=both');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('formatted');
      expect(typeof response.body.data.timestamp).toBe('number');
      expect(typeof response.body.data.formatted).toBe('string');
      expect(response.body.data.formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    }, 10000);

    it('should return error for invalid format', async () => {
      const response = await request(app).get('/time?format=invalid');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INVALID_VALUE');
    }, 10000);
  });
});