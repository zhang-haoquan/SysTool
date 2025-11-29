# MCP Server

Management Control Protocol Server implementation with Node.js.

## Features

- System time retrieval service
- Modular architecture for extensibility
- RESTful API design
- Comprehensive logging
- Unit testing coverage
- Plugin system (future extension)
- Configurable settings

## Installation

```bash
npm install
```

## Usage

```bash
# Start the server
npm start

# Development mode with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

### Get Current Time

```
GET /api/time
```

Parameters:
- `format`: Response format (`timestamp`, `formatted`, or `both`)
  - `timestamp`: Returns Unix timestamp (default)
  - `formatted`: Returns formatted string (YYYY-MM-DD HH:MM:SS)
  - `both`: Returns both timestamp and formatted time

Example responses:

Timestamp format:
```json
{
  "success": true,
  "data": {
    "timestamp": 1678901234
  }
}
```

Formatted format:
```json
{
  "success": true,
  "data": {
    "formatted": "2023-03-15 18:27:14"
  }
}
```

Both format:
```json
{
  "success": true,
  "data": {
    "timestamp": 1678901234,
    "formatted": "2023-03-15 18:27:14"
  }
}
```

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2023-03-15T18:27:14.123Z",
  "service": "MCP Server"
}
```

## Configuration

The server can be configured using environment variables:

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)
- `LOG_LEVEL`: Logging level (default: info)
- `LOG_FILE`: Log file path (default: logs/mcp-server.log)
- `PLUGINS_ENABLED`: Enable plugin system (default: false)
- `PLUGINS_DIRECTORY`: Plugins directory path (default: ./plugins)
- `REQUEST_LOGGING`: Enable request logging (default: true)

## Architecture

The server follows a layered architecture:

```
┌─────────────────┐
│   Controller    │ ← Handles HTTP requests/responses
├─────────────────┤
│    Service      │ ← Implements business logic
├─────────────────┤
│    Utility      │ ← Provides common helper functions
└─────────────────┘
```

- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Implements business logic
- **Utility Layer**: Provides common helper functions
- **Middleware Layer**: Handles cross-cutting concerns (logging, error handling)
- **Configuration Layer**: Manages application settings

## Testing

Run unit tests with:

```bash
npm test
```

Run tests with coverage reporting:

```bash
npm run test:coverage
```

## Extending the Server

### Adding New Endpoints

1. Create a new service in `src/services/`
2. Create a new controller in `src/controllers/`
3. Add routes in `src/routes/`
4. Register routes in `src/routes/index.js`

### Plugin System

The server includes a plugin system for future extensions. To enable:

1. Set `PLUGINS_ENABLED=true` in environment variables
2. Place plugin files in the plugins directory (default: `./plugins`)
3. Plugins should export an object with at least a `name` property

Example plugin structure:
```javascript
// plugins/examplePlugin.js
module.exports = {
  name: 'example-plugin',
  version: '1.0.0',
  init: function(server) {
    // Plugin initialization code
    console.log('Example plugin initialized');
  }
};
```

## Error Handling

The server implements a unified error handling system:

- Custom `MCPError` class for application-specific errors
- Global error handler middleware
- Consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Logging

The server uses Winston for logging with both file and console transports. Logs include:

- Request/response logging
- Error logging
- Application events
- Debug information

Log format:
```
{"level":"info","message":"Incoming request","timestamp":"2023-03-15T18:27:14.123Z","service":"mcp-server","method":"GET","url":"/api/time","ip":"::1"}
```