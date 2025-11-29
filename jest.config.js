// Jest configuration for MCP Server

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/index.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  verbose: true
};