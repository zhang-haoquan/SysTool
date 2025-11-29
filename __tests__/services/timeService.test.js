// Unit tests for TimeService

const TimeService = require('../../src/services/timeService');
const { MCPError } = require('../../src/middleware/errorHandler');

describe('TimeService', () => {
  let timeService;

  beforeEach(() => {
    timeService = new TimeService();
  });

  describe('getCurrentTimestamp', () => {
    it('should return a valid timestamp', () => {
      const timestamp = timeService.getCurrentTimestamp();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    it('should return timestamp in seconds', () => {
      const timestamp = timeService.getCurrentTimestamp();
      const jsTimestamp = Date.now();
      // Should be within a few seconds of JavaScript timestamp (which is in milliseconds)
      expect(Math.abs(timestamp - Math.floor(jsTimestamp / 1000))).toBeLessThan(5);
    });
  });

  describe('formatDateTime', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-03-15T10:30:45Z');
      const formatted = timeService.formatDateTime(date);
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(formatted).toBe('2023-03-15 10:30:45');
    });

    it('should pad single digit values with zero', () => {
      const date = new Date('2023-01-01T01:01:01Z');
      const formatted = timeService.formatDateTime(date);
      expect(formatted).toBe('2023-01-01 01:01:01');
    });
  });

  describe('getCurrentTimeInfo', () => {
    it('should return both timestamp and formatted time', () => {
      const timeInfo = timeService.getCurrentTimeInfo();
      expect(timeInfo).toHaveProperty('timestamp');
      expect(timeInfo).toHaveProperty('formatted');
      expect(typeof timeInfo.timestamp).toBe('number');
      expect(typeof timeInfo.formatted).toBe('string');
      expect(timeInfo.formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('getTime', () => {
    it('should return timestamp when format is "timestamp"', () => {
      const result = timeService.getTime('timestamp');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('number');
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('should return formatted time when format is "formatted"', () => {
      const result = timeService.getTime('formatted');
      expect(result).toHaveProperty('formatted');
      expect(typeof result.formatted).toBe('string');
      expect(result.formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should return both when format is "both"', () => {
      const result = timeService.getTime('both');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('formatted');
      expect(typeof result.timestamp).toBe('number');
      expect(typeof result.formatted).toBe('string');
      expect(result.timestamp).toBeGreaterThan(0);
      expect(result.formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should default to timestamp format when no format is provided', () => {
      const result = timeService.getTime();
      expect(result).toHaveProperty('timestamp');
      expect(result).not.toHaveProperty('formatted');
    });
    
    it('should handle undefined format parameter', () => {
      const result = timeService.getTime(undefined);
      expect(result).toHaveProperty('timestamp');
      expect(result).not.toHaveProperty('formatted');
    });

    it('should handle null format parameter', () => {
      const result = timeService.getTime(null);
      expect(result).toHaveProperty('timestamp');
      expect(result).not.toHaveProperty('formatted');
    });

    it('should throw MCPError for invalid format', () => {
      expect(() => {
        timeService.getTime('invalid');
      }).toThrow(MCPError);
      
      try {
        timeService.getTime('invalid');
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.errorCode).toBe('INVALID_VALUE');
        expect(error.message).toContain('Invalid value for format');
      }
    });
  });
});