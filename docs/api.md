# MCP Server API Documentation

## Overview

The MCP Server provides a RESTful API for system management and control functions. The initial implementation includes a system time retrieval service.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. Future versions may implement token-based authentication.

## Error Responses

All error responses follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

Common error codes:
- `INVALID_FORMAT`: Invalid format parameter
- `INVALID_VALUE`: Invalid parameter value
- `MISSING_PARAMETER`: Required parameter is missing
- `TIME_RETRIEVAL_FAILED`: Failed to retrieve system time
- `INTERNAL_ERROR`: Unexpected server error

## Endpoints

### Get System Time

#### Request

```
GET /time
```

##### Query Parameters

| Parameter | Type   | Required | Description                           | Default   |
|-----------|--------|----------|---------------------------------------|-----------|
| format    | string | No       | Response format (see below)           | timestamp |

Supported format values:
- `timestamp`: Unix timestamp in seconds
- `formatted`: Human-readable date/time string
- `both`: Both timestamp and formatted time

#### Response

##### Success (200)

###### Format: timestamp
```json
{
  "success": true,
  "data": {
    "timestamp": 1678901234
  }
}
```

###### Format: formatted
```json
{
  "success": true,
  "data": {
    "formatted": "2023-03-15 18:27:14"
  }
}
```

###### Format: both
```json
{
  "success": true,
  "data": {
    "timestamp": 1678901234,
    "formatted": "2023-03-15 18:27:14"
  }
}
```

##### Error (400)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FORMAT",
    "message": "Invalid format parameter: invalid. Supported formats: timestamp, formatted, both"
  }
}
```

### Health Check

#### Request

```
GET /health
```

#### Response

##### Success (200)
```json
{
  "status": "OK",
  "timestamp": "2023-03-15T18:27:14.123Z",
  "service": "MCP Server"
}
```

## Examples

### Get current timestamp
```bash
curl http://localhost:3000/api/time
```

### Get formatted time
```bash
curl http://localhost:3000/api/time?format=formatted
```

### Get both timestamp and formatted time
```bash
curl http://localhost:3000/api/time?format=both
```

### Health check
```bash
curl http://localhost:3000/api/health
```