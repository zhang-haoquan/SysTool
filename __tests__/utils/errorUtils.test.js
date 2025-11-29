// Unit tests for error utilities

const { createError, validateRequiredParams, validateAllowedValues, MCPError } = require('../../src/utils/errorUtils');

describe('Error Utilities', () => {
  describe('createError', () => {
    it('should create MCPError with default values', () => {
      const error = createError('Test error');
      expect(error).toBeInstanceOf(MCPError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.errorCode).toBe('UNKNOWN_ERROR');
    });

    it('should create MCPError with custom values', () => {
      const error = createError('Test error', 400, 'TEST_ERROR');
      expect(error).toBeInstanceOf(MCPError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.errorCode).toBe('TEST_ERROR');
    });
  });

  describe('validateRequiredParams', () => {
    it('should not throw error when all required params are present', () => {
      const params = { name: 'test', value: 123 };
      expect(() => validateRequiredParams(params, ['name', 'value'])).not.toThrow();
    });

    it('should throw MCPError when required param is missing', () => {
      const params = { name: 'test' };
      expect(() => validateRequiredParams(params, ['name', 'value'])).toThrow(MCPError);
      
      try {
        validateRequiredParams(params, ['name', 'value']);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.errorCode).toBe('MISSING_PARAMETER');
        expect(error.message).toBe('Missing required parameter: value');
      }
    });

    it('should throw MCPError when required param is null', () => {
      const params = { name: 'test', value: null };
      expect(() => validateRequiredParams(params, ['name', 'value'])).toThrow(MCPError);
    });

    it('should throw MCPError when required param is undefined', () => {
      const params = { name: 'test', value: undefined };
      expect(() => validateRequiredParams(params, ['name', 'value'])).toThrow(MCPError);
    });
  });

  describe('validateAllowedValues', () => {
    it('should not throw error when value is in allowed list', () => {
      expect(() => validateAllowedValues('format', 'json', ['json', 'xml', 'csv'])).not.toThrow();
    });

    it('should throw MCPError when value is not in allowed list', () => {
      expect(() => validateAllowedValues('format', 'invalid', ['json', 'xml', 'csv'])).toThrow(MCPError);
      
      try {
        validateAllowedValues('format', 'invalid', ['json', 'xml', 'csv']);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.errorCode).toBe('INVALID_VALUE');
        expect(error.message).toContain('Invalid value for format: invalid');
      }
    });
  });
});