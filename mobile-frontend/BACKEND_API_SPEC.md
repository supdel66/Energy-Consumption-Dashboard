# Backend API Integration Guide

This document outlines the exact API specifications that the frontend expects from the backend services.

## 🔗 Base Configuration

```
Base URL: /api/v1
Content-Type: application/json
Authentication: Bearer token in Authorization header
```

## 📡 WebSocket Endpoints

### Connection
```
WS /ws/real-time-consumption/:meterId
WS /ws/transformer-status/:transformerId
WS /ws/pricing-updates
WS /ws/notifications/:consumerId
WS /ws/grid-events
```

### WebSocket Message Format
```typescript
{
  "type": "meter_reading" | "transformer_status" | "pricing_update" | "notification" | "alert",
  "data": {}, // Type-specific payload
  "timestamp": "2026-01-20T14:30:00Z"
}
```

---

## 🔐 Authentication

### POST /api/v1/auth/login
Login user and receive JWT token.

**Request:**
```json
{
  "email": "admin123@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "expiresIn": 3600,
  "user": {
    "userId": "U-1001",
    "email": "admin123@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

---

### POST /api/v1/auth/logout
Invalidate current session.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/v1/auth/verify
Verify token validity.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "expiresAt": "2026-01-20T15:30:00Z"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or expired token

---

## 👤 Consumer Management

### GET /api/v1/consumers/:consumerId
Get consumer details.

**Response (200 OK):**
```json
{
  "consumerId": "C-1001",
  "name": "Admin 123",
  "email": "admin123@example.com",
  "phone": "+977-9841234567",
  "address": "ward no - 32, Pepsicola, Kathmandu",
  "location": {
    "lat": 27.6915,
    "lng": 85.3436
  },
  "consumerType": "domestic",
  "tariffCategory": "5A",
  "registrationDate": "2024-01-10T00:00:00Z",
  "preferences": {
    "notificationsEnabled": true,
    "emailNotifications": true,
    "smsNotifications": false
  }
}
```

---

### GET /api/v1/consumers/:consumerId/consumption
Get consumer consumption history.

**Query Parameters:**
- `start_date` (required): ISO 8601 date
- `end_date` (required): ISO 8601 date
- `interval` (optional): "hourly" | "daily" | "monthly" (default: "hourly")

**Example:** `/api/v1/consumers/C-1001/consumption?start_date=2026-01-19T00:00:00Z&end_date=2026-01-20T23:59:59Z&interval=hourly`

**Response (200 OK):**
```json
{
  "consumerId": "C-1001",
  "meterId": "M-1001",
  "startDate": "2026-01-19T00:00:00Z",
  "endDate": "2026-01-20T23:59:59Z",
  "interval": "hourly",
  "totalConsumption": 2688.0,
  "averageConsumption": 112.0,
  "peakConsumption": 145.5,
  "readings": [
    {
      "timestamp": "2026-01-19T00:00:00Z",
      "consumptionKwh": 95.5,
      "cost": 716.25
    },
    {
      "timestamp": "2026-01-19T01:00:00Z",
      "consumptionKwh": 88.2,
      "cost": 661.50
    }
    // ... more readings
  ]
}
```

---

### GET /api/v1/consumers/:consumerId/iot-devices
Get all IoT devices for a consumer.

**Response (200 OK):**
```json
{
  "consumerId": "C-1001",
  "devices": [
    {
      "deviceId": "IOT-5001",
      "deviceName": "Living Room AC",
      "deviceType": "AC",
      "manufacturer": "Samsung",
      "powerRatingWatts": 1500,
      "controllable": true,
      "priority": 3,
      "automationEnabled": true,
      "currentState": "on",
      "lastUpdated": "2026-01-20T14:30:00Z",
      "metadata": {
        "room": "Living Room",
        "temperature": 24
      }
    },
    {
      "deviceId": "IOT-5002",
      "deviceName": "Water Heater",
      "deviceType": "water_heater",
      "manufacturer": "Local Brand",
      "powerRatingWatts": 2000,
      "controllable": true,
      "priority": 2,
      "automationEnabled": false,
      "currentState": "off",
      "lastUpdated": "2026-01-20T14:30:00Z"
    }
  ],
  "totalDevices": 2,
  "activeDevices": 1,
  "totalPower": 1500
}
```

---

## 📊 Smart Meter Data

### GET /api/v1/meters/:meterId
Get smart meter details.

**Response (200 OK):**
```json
{
  "meterId": "M-1001",
  "consumerId": "C-1001",
  "transformerId": "TRF-101",
  "location": {
    "lat": 27.6918,
    "lng": 85.3438
  },
  "installationDate": "2024-01-15T00:00:00Z",
  "meterType": "Smart Digital",
  "firmwareVersion": "2.1.5",
  "communicationProtocol": "MQTT",
  "status": "active",
  "lastHeartbeat": "2026-01-20T14:30:00Z"
}
```

---

### GET /api/v1/meters/:meterId/consumption
Get meter consumption data.

**Query Parameters:**
- `start_date` (required): ISO 8601 date
- `end_date` (required): ISO 8601 date
- `interval` (optional): "hourly" | "daily" | "monthly"

**Response (200 OK):**
```json
{
  "meterId": "M-1001",
  "readings": [
    {
      "readingId": 123456,
      "timestamp": "2026-01-20T14:00:00Z",
      "consumptionKwh": 112.5,
      "voltage": 230.5,
      "current": 15.3,
      "powerFactor": 0.95,
      "frequency": 50.0,
      "temperature": 28.5,
      "qualityFlag": "good"
    }
    // ... more readings
  ],
  "totalReadings": 1,
  "aggregates": {
    "totalConsumption": 2688.0,
    "averageVoltage": 230.2,
    "averagePowerFactor": 0.94
  }
}
```

---

### GET /api/v1/meters/:meterId/real-time
Get current real-time reading from meter.

**Response (200 OK):**
```json
{
  "meterId": "M-1001",
  "timestamp": "2026-01-20T14:30:15Z",
  "consumptionKwh": 112.5,
  "voltage": 230.5,
  "current": 15.3,
  "powerFactor": 0.95,
  "frequency": 50.0,
  "temperature": 28.5,
  "status": "normal"
}
```

---

## 🔌 Transformer Management

### GET /api/v1/transformers
Get all transformers (with optional filtering).

**Query Parameters:**
- `area` (optional): Filter by area
- `ward_no` (optional): Filter by ward number
- `status` (optional): Filter by status

**Response (200 OK):**
```json
{
  "transformers": [
    {
      "transformerId": "TRF-101",
      "name": "Transformer no 101",
      "location": {
        "lat": 27.6915,
        "lng": 85.3436
      },
      "wardNo": 32,
      "area": "Pepsicola, Kathmandu",
      "capacityKva": 500,
      "voltageRating": "11kV/400V",
      "status": "healthy",
      "healthScore": 80,
      "loadPercentage": 72.5,
      "temperatureCelsius": 32,
      "installationDate": "2020-01-15T00:00:00Z",
      "manufacturer": "Nepal Transformers Ltd"
    }
    // ... more transformers
  ],
  "total": 1,
  "page": 1,
  "perPage": 50
}
```

---

### GET /api/v1/transformers/:transformerId
Get detailed transformer information.

**Response (200 OK):**
```json
{
  "transformerId": "TRF-101",
  "name": "Transformer no 101",
  "location": {
    "lat": 27.6915,
    "lng": 85.3436
  },
  "wardNo": 32,
  "area": "Pepsicola, Kathmandu",
  "capacityKva": 500,
  "voltageRating": "11kV/400V",
  "status": "healthy",
  "healthScore": 80,
  "loadPercentage": 72.5,
  "temperatureCelsius": 32,
  "lossPercentage": 4.1,
  "totalConsumptionKwh": 12000,
  "connectedMeters": 25,
  "installationDate": "2020-01-15T00:00:00Z",
  "manufacturer": "Nepal Transformers Ltd",
  "metadata": {
    "lastMaintenance": "2025-12-01T00:00:00Z",
    "nextMaintenance": "2026-06-01T00:00:00Z"
  }
}
```

---

### GET /api/v1/transformers/:transformerId/health
Get real-time transformer health metrics.

**Response (200 OK):**
```json
{
  "transformerId": "TRF-101",
  "timestamp": "2026-01-20T14:30:00Z",
  "loadPercentage": 72.5,
  "temperatureCelsius": 32,
  "voltageLevel": 230,
  "totalConsumptionKwh": 1344,
  "lossPercentage": 4.1,
  "healthScore": 80,
  "anomalyDetected": false,
  "alerts": []
}
```

---

### GET /api/v1/transformers/:transformerId/consumption
Get transformer aggregate consumption.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)
- `interval` (optional)

**Response (200 OK):**
```json
{
  "transformerId": "TRF-101",
  "startDate": "2026-01-19T00:00:00Z",
  "endDate": "2026-01-20T23:59:59Z",
  "interval": "hourly",
  "readings": [
    {
      "timestamp": "2026-01-19T00:00:00Z",
      "totalConsumptionKwh": 1250.5,
      "loadPercentage": 65.2,
      "averageVoltage": 230.1,
      "peakLoad": 1450.0
    }
    // ... more readings
  ]
}
```

---

### GET /api/v1/transformers/map-view
Get transformers formatted for map display (with clustering support).

**Query Parameters:**
- `bounds`: lat1,lng1,lat2,lng2 (map viewport bounds)
- `zoom_level`: number (for clustering logic)

**Response (200 OK):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [85.3436, 27.6915]
      },
      "properties": {
        "transformerId": "TRF-101",
        "name": "Transformer no 101",
        "healthScore": 80,
        "loadPercentage": 72.5,
        "totalConsumption": 1344,
        "temperature": 32,
        "status": "healthy"
      }
    }
  ]
}
```

---

## 💰 Dynamic Pricing

### GET /api/v1/pricing/current
Get current pricing rate.

**Query Parameters:**
- `transformer_id` (required): Transformer ID
- `consumer_id` (optional): For consumer-specific rates

**Response (200 OK):**
```json
{
  "rateId": 12345,
  "transformerId": "TRF-101",
  "timestamp": "2026-01-20T14:30:00Z",
  "baseRate": 7.50,
  "dynamicMultiplier": 1.2,
  "finalRate": 9.00,
  "demandLevel": "high",
  "gridLoadPercentage": 85.0,
  "algorithmVersion": "v1.2.3",
  "validUntil": "2026-01-20T14:45:00Z"
}
```

---

### GET /api/v1/pricing/forecast
Get forecasted pricing rates.

**Query Parameters:**
- `transformer_id` (required)
- `hours_ahead` (optional): Default 4, max 24

**Response (200 OK):**
```json
{
  "transformerId": "TRF-101",
  "currentRate": 9.00,
  "forecast": [
    {
      "timestamp": "2026-01-20T15:00:00Z",
      "baseRate": 7.50,
      "dynamicMultiplier": 1.15,
      "finalRate": 8.625,
      "demandLevel": "medium",
      "confidence": 0.92
    },
    {
      "timestamp": "2026-01-20T16:00:00Z",
      "baseRate": 7.50,
      "dynamicMultiplier": 0.85,
      "finalRate": 6.375,
      "demandLevel": "low",
      "confidence": 0.88
    }
    // ... more forecasts
  ]
}
```

---

### GET /api/v1/pricing/history
Get historical pricing data.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)
- `transformer_id` (required)

**Response (200 OK):**
```json
{
  "transformerId": "TRF-101",
  "rates": [
    {
      "timestamp": "2026-01-19T00:00:00Z",
      "finalRate": 7.50,
      "demandLevel": "low"
    }
    // ... more rates
  ]
}
```

---

## 🤖 AI/ML Predictions

### GET /api/v1/predictions/demand
Get demand forecast.

**Query Parameters:**
- `transformer_id` (required)
- `forecast_period` (optional): hours ahead (default 24)

**Response (200 OK):**
```json
{
  "transformerId": "TRF-101",
  "forecastTimestamp": "2026-01-20T14:30:00Z",
  "predictions": [
    {
      "timestamp": "2026-01-20T15:00:00Z",
      "predictedDemandKwh": 1380.5,
      "confidenceIntervalLower": 1250.0,
      "confidenceIntervalUpper": 1510.0,
      "confidence": 0.95
    }
    // ... more predictions
  ],
  "modelVersion": "demand-lstm-v2.1",
  "accuracy": {
    "mape": 4.5,
    "rmse": 45.2
  }
}
```

---

### GET /api/v1/predictions/cost
Get cost forecast for consumer.

**Query Parameters:**
- `consumer_id` (required)
- `forecast_period` (optional): hours ahead

**Response (200 OK):**
```json
{
  "consumerId": "C-1001",
  "predictions": [
    {
      "timestamp": "2026-01-20T15:00:00Z",
      "predictedConsumptionKwh": 112.5,
      "predictedRate": 8.50,
      "predictedCost": 956.25
    }
    // ... more predictions
  ],
  "totalPredictedCost": 22950.0
}
```

---

## 🏠 IoT Device Control

### GET /api/v1/iot/devices/:deviceId
Get device details.

**Response (200 OK):**
```json
{
  "deviceId": "IOT-5001",
  "consumerId": "C-1001",
  "deviceName": "Living Room AC",
  "deviceType": "AC",
  "manufacturer": "Samsung",
  "powerRatingWatts": 1500,
  "controllable": true,
  "priority": 3,
  "automationEnabled": true,
  "currentState": "on",
  "lastUpdated": "2026-01-20T14:30:00Z",
  "metadata": {
    "room": "Living Room",
    "temperature": 24
  }
}
```

---

### PUT /api/v1/iot/devices/:deviceId/state
Control device state.

**Request:**
```json
{
  "state": "on",
  "scheduled": false,
  "scheduleTime": null
}
```

**Response (200 OK):**
```json
{
  "deviceId": "IOT-5001",
  "currentState": "on",
  "updatedAt": "2026-01-20T14:30:00Z",
  "message": "Device state updated successfully"
}
```

---

### POST /api/v1/iot/devices/:deviceId/automation
Configure automation rules.

**Request:**
```json
{
  "enabled": true,
  "rules": [
    {
      "condition": "price_above",
      "threshold": 10.0,
      "action": "turn_off"
    },
    {
      "condition": "price_below",
      "threshold": 6.0,
      "action": "turn_on"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "deviceId": "IOT-5001",
  "automationEnabled": true,
  "rules": [
    {
      "ruleId": "R-001",
      "condition": "price_above",
      "threshold": 10.0,
      "action": "turn_off"
    }
  ],
  "message": "Automation configured successfully"
}
```

---

### GET /api/v1/iot/devices/:deviceId/consumption
Get device-specific consumption.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

**Response (200 OK):**
```json
{
  "deviceId": "IOT-5001",
  "totalConsumption": 36.0,
  "averageDailyConsumption": 12.0,
  "operatingHours": 24,
  "costBreakdown": {
    "totalCost": 270.0,
    "averageRate": 7.50
  }
}
```

---

## 🔔 Notifications

### GET /api/v1/notifications
Get notifications for consumer.

**Query Parameters:**
- `consumer_id` (optional): Filter by consumer
- `status` (optional): "sent" | "read" | "dismissed"
- `type` (optional): Filter by notification type
- `limit` (optional): Number of results (default 50)

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "notificationId": 1001,
      "consumerId": "C-1001",
      "notificationType": "high_usage",
      "title": "High Consumption Alert",
      "message": "Your consumption exceeded 150 kWh in the last hour. Consider reducing usage to save costs.",
      "priority": "high",
      "status": "sent",
      "metadata": {
        "consumption": 152.5,
        "threshold": 150.0
      },
      "createdAt": "2026-01-20T14:25:00Z",
      "readAt": null
    },
    {
      "notificationId": 1002,
      "consumerId": "C-1001",
      "notificationType": "price_change",
      "title": "Price Update",
      "message": "Electricity rates decreased to NPR 6.50/kWh. Good time to use high-power devices.",
      "priority": "medium",
      "status": "read",
      "metadata": {
        "newRate": 6.50,
        "oldRate": 9.00
      },
      "createdAt": "2026-01-20T13:00:00Z",
      "readAt": "2026-01-20T13:05:00Z"
    }
  ],
  "total": 2,
  "unreadCount": 1
}
```

---

### POST /api/v1/notifications/mark-read/:notificationId
Mark notification as read.

**Response (200 OK):**
```json
{
  "notificationId": 1001,
  "status": "read",
  "readAt": "2026-01-20T14:30:00Z",
  "message": "Notification marked as read"
}
```

---

## 🗺️ Geospatial & Maps

### GET /api/v1/maps/meters
Get meters for map display.

**Query Parameters:**
- `bounds`: lat1,lng1,lat2,lng2
- `transformer_id` (optional): Filter by transformer

**Response (200 OK):**
```json
{
  "meters": [
    {
      "meterId": "M-1001",
      "location": {
        "lat": 27.6918,
        "lng": 85.3438
      },
      "consumption": 112.5,
      "status": "active",
      "consumerId": "C-1001"
    }
  ],
  "total": 1
}
```

---

### GET /api/v1/maps/consumption-heatmap
Get heatmap data for consumption visualization.

**Query Parameters:**
- `bounds`: lat1,lng1,lat2,lng2
- `timestamp` (optional): Specific time (default: current)

**Response (200 OK):**
```json
{
  "heatmapData": [
    {
      "location": {
        "lat": 27.6915,
        "lng": 85.3436
      },
      "weight": 112.5
    },
    {
      "location": {
        "lat": 27.6918,
        "lng": 85.3438
      },
      "weight": 122.3
    }
  ],
  "maxIntensity": 200.0,
  "timestamp": "2026-01-20T14:30:00Z"
}
```

---

## ⚠️ Error Responses

All endpoints should return consistent error formats:

**4xx Client Errors:**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: transformer_id",
    "field": "transformer_id",
    "timestamp": "2026-01-20T14:30:00Z"
  }
}
```

**5xx Server Errors:**
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_abc123xyz",
    "timestamp": "2026-01-20T14:30:00Z"
  }
}
```

**Common Error Codes:**
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## 🔄 Rate Limiting

All endpoints should implement rate limiting:

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642684800
```

**Rate Limit Exceeded (429):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## 📝 Notes for Backend Developers

1. **Timestamps**: Always use ISO 8601 format with UTC timezone
2. **Pagination**: Implement pagination for list endpoints (page, perPage)
3. **CORS**: Enable CORS for frontend domain in production
4. **WebSockets**: Implement heartbeat/ping-pong for connection health
5. **Authentication**: Use JWT with reasonable expiry times
6. **Validation**: Validate all inputs and return meaningful error messages
7. **Logging**: Log all API requests for debugging and analytics
8. **Performance**: Implement caching where appropriate (Redis)
9. **Security**: Rate limit, sanitize inputs, encrypt sensitive data
10. **Documentation**: Keep this spec updated with any API changes

---

**Questions or Issues?**
Contact the frontend team or create an issue in the repository.
