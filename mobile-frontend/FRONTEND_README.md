# Bijulibatti - Smart Grid Frontend

A modern, real-time dashboard for Nepal's Virtual Smart Grid electricity management system with AI-powered dynamic pricing, interactive maps, and IoT device control.

## 🎯 Overview

This Next.js frontend provides a comprehensive interface for monitoring and managing Nepal's smart grid infrastructure, featuring:

- **Interactive Google Maps** integration showing transformers and consumer meters
- **Real-time monitoring** via WebSocket connections
- **Dynamic pricing** display with forecasts
- **IoT device control** for automated energy management
- **Consumption analytics** with charts and trends
- **Notification system** for alerts and updates
- **Transformer health** monitoring
- **Consumer panels** with detailed consumption data

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps Platform (@vis.gl/react-google-maps)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Real-time**: WebSocket (native)
- **State Management**: React Hooks

### Project Structure

```
bijulibatti/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── page.tsx        # Main dashboard
│   │   ├── layout.tsx      # Dashboard layout
│   │   └── loading.tsx     # Loading state
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
│
├── components/
│   ├── dashboard/
│   │   ├── ConsumerPanel.tsx          # Consumer detail sidebar
│   │   ├── TransformerPanel.tsx       # Transformer detail sidebar
│   │   ├── Header.tsx                 # Dashboard header with search
│   │   ├── Notifications.tsx          # Real-time notifications
│   │   ├── PricingDisplay.tsx         # Dynamic pricing widget
│   │   ├── IoTDeviceControl.tsx       # IoT device management
│   │   ├── Map/
│   │   │   ├── GridMap.tsx            # Main map component
│   │   │   ├── ConsumerMarker.tsx     # Meter markers
│   │   │   └── TransformerMarker.tsx  # Transformer markers
│   │   ├── Sidebar/
│   │   │   └── Sidebar.tsx            # Navigation sidebar
│   │   └── Widgets/
│   │       ├── ConsumptionChart.tsx   # Consumption graphs
│   │       └── TransformerHealth.tsx  # Health metrics
│   └── shared/
│       └── GlassCard.tsx              # Reusable glass card UI
│
├── lib/
│   ├── api-client.ts       # Backend API integration
│   ├── websocket-client.ts # Real-time WebSocket client
│   ├── types.ts            # TypeScript interfaces
│   └── mock-data.ts        # Development mock data
│
├── public/                 # Static assets
├── .env.local             # Environment variables
└── next.config.ts         # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Google Maps API key
- Backend API running (see Backend Integration section)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bijulibatti
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_MAP_ID=your_map_id_here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Optional: Enable mock data during development
NEXT_PUBLIC_USE_MOCK_DATA=false
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 Backend Integration

### API Client (`lib/api-client.ts`)

The frontend communicates with the backend through a centralized API client that handles:

- HTTP requests with proper error handling
- Authentication token management
- Request/response transformation
- TypeScript type safety

### Required Backend Endpoints

The frontend expects these RESTful API endpoints (as defined in the project spec):

#### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/verify
```

#### Consumers
```
GET    /api/v1/consumers/:consumerId
GET    /api/v1/consumers/:consumerId/consumption
GET    /api/v1/consumers/:consumerId/iot-devices
```

#### Smart Meters
```
GET    /api/v1/meters/:meterId
GET    /api/v1/meters/:meterId/consumption
GET    /api/v1/meters/:meterId/real-time
```

#### Transformers
```
GET    /api/v1/transformers
GET    /api/v1/transformers/:transformerId
GET    /api/v1/transformers/:transformerId/health
GET    /api/v1/transformers/:transformerId/consumption
```

#### Dynamic Pricing
```
GET    /api/v1/pricing/current?transformer_id=xxx
GET    /api/v1/pricing/forecast?transformer_id=xxx&hours_ahead=4
```

#### IoT Devices
```
GET    /api/v1/iot/devices/:deviceId
PUT    /api/v1/iot/devices/:deviceId/state
POST   /api/v1/iot/devices/:deviceId/automation
```

#### Notifications
```
GET    /api/v1/notifications?consumer_id=xxx
POST   /api/v1/notifications/mark-read/:notificationId
```

### WebSocket Integration (`lib/websocket-client.ts`)

Real-time data is received through WebSocket connections:

```typescript
// Connection endpoints
ws://your-backend/ws/real-time-consumption/:meterId
ws://your-backend/ws/transformer-status/:transformerId
ws://your-backend/ws/pricing-updates
ws://your-backend/ws/notifications/:consumerId
```

**Message Format:**
```typescript
{
  type: 'meter_reading' | 'transformer_status' | 'pricing_update' | 'notification',
  data: {
    // Type-specific payload
  },
  timestamp: string
}
```

### Backend Response Formats

#### Consumer Data
```json
{
  "consumerId": "C-1001",
  "name": "Admin 123",
  "email": "admin123@example.com",
  "address": "ward no - 32, Pepsicola, Kathmandu",
  "location": { "lat": 27.6915, "lng": 85.3436 },
  "consumerType": "domestic",
  "tariffCategory": "5A"
}
```

#### Consumption Reading
```json
{
  "meterId": "M-1001",
  "timestamp": "2026-01-20T14:30:00Z",
  "consumptionKwh": 112.5,
  "voltage": 230.5,
  "current": 15.3,
  "powerFactor": 0.95,
  "status": "normal"
}
```

#### Transformer Health
```json
{
  "transformerId": "TRF-101",
  "timestamp": "2026-01-20T14:30:00Z",
  "loadPercentage": 72.5,
  "temperatureCelsius": 32,
  "healthScore": 80,
  "lossPercentage": 4.1,
  "totalConsumptionKwh": 1344,
  "voltageLevel": 230,
  "anomalyDetected": false
}
```

#### Pricing Rate
```json
{
  "rateId": 12345,
  "transformerId": "TRF-101",
  "timestamp": "2026-01-20T14:30:00Z",
  "baseRate": 7.50,
  "dynamicMultiplier": 1.2,
  "finalRate": 9.00,
  "demandLevel": "high",
  "gridLoadPercentage": 85,
  "validUntil": "2026-01-20T14:45:00Z"
}
```

#### IoT Device
```json
{
  "deviceId": "IOT-5001",
  "consumerId": "C-1001",
  "deviceName": "Living Room AC",
  "deviceType": "AC",
  "powerRatingWatts": 1500,
  "controllable": true,
  "priority": 3,
  "automationEnabled": true,
  "currentState": "on",
  "lastUpdated": "2026-01-20T14:30:00Z"
}
```

## 🗺️ Google Maps Setup

### Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for search)

### Create a Map ID

1. Go to Google Maps Platform > Map Management
2. Create a new Map ID
3. Set the map type to "Vector"
4. Choose "Dark" theme for consistency with UI
5. Copy the Map ID to your `.env.local`

### Restrict API Key (Production)

For production, restrict your API key:
- HTTP referrers: `yourdomain.com/*`
- API restrictions: Enable only Maps JavaScript API

## 🎨 UI Components

### GlassCard

Reusable glassmorphism card component:

```tsx
<GlassCard className="p-4">
  {/* Your content */}
</GlassCard>
```

### ConsumerPanel

Sidebar showing detailed consumer information:

```tsx
<ConsumerPanel
  consumer={consumerData}
  onClose={() => setSelectedConsumer(null)}
/>
```

### TransformerPanel

Sidebar displaying transformer health and metrics:

```tsx
<TransformerPanel
  transformer={transformerData}
  onClose={() => setSelectedTransformer(null)}
/>
```

### PricingDisplay

Widget showing current and forecasted pricing:

```tsx
<PricingDisplay transformerId="TRF-101" />
```

### IoTDeviceControl

Interface for controlling IoT devices:

```tsx
<IoTDeviceControl consumerId="C-1001" />
```

### Notifications

Notification bell with dropdown:

```tsx
<Notifications consumerId="C-1001" />
```

## 🔄 Real-time Updates

The app maintains WebSocket connections for real-time data:

1. **Meter Readings**: Updates every 5 seconds
2. **Transformer Health**: Updates every 30 seconds
3. **Pricing**: Updates every 15 minutes or on demand change
4. **Notifications**: Instant push

**Automatic Reconnection:**
- Implements exponential backoff
- Reconnects on connection loss
- Queues messages during disconnection

## 📊 Mock Data

During development, mock data is available in `lib/mock-data.ts`:

- 2 transformers (healthy, overloaded)
- 25 smart meters with random consumption
- 2 consumers
- Simulated consumption history

To use mock data, set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`

## 🔒 Security

### Authentication Flow

1. User logs in via `/api/v1/auth/login`
2. Backend returns JWT token
3. Token stored in `localStorage` or `httpOnly` cookie
4. Included in all API requests via `Authorization` header
5. WebSocket authenticated via token in connection params

### API Security

```typescript
// Example authenticated request
const response = await fetch('/api/v1/consumers/C-1001', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables (Production)

Ensure these are set in your production environment:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_key
NEXT_PUBLIC_MAP_ID=your_map_id
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

### Deployment Platforms

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** + Kubernetes

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Unit Tests (coming soon)

```bash
npm run test
```

### E2E Tests (coming soon)

```bash
npm run test:e2e
```

## 📈 Performance Optimization

- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: Using `next/image`
- **Lazy Loading**: Components loaded on demand
- **Caching**: API responses cached appropriately
- **WebSocket Throttling**: Data updates throttled to prevent overload

## 🐛 Troubleshooting

### Map not displaying

- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check browser console for API errors
- Ensure Maps JavaScript API is enabled
- Verify billing is enabled on Google Cloud

### WebSocket connection failing

- Check `NEXT_PUBLIC_WS_URL` is correct
- Verify backend WebSocket server is running
- Check browser console for connection errors
- Ensure CORS is properly configured on backend

### API requests failing

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check network tab in browser dev tools
- Ensure backend is running and accessible
- Verify authentication token is valid

## 📝 License

[Your License Here]

## 🤝 Contributing

[Contributing Guidelines]

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@bijulibatti.com
- Documentation: https://docs.bijulibatti.com

---

**Built with ❤️ for Nepal's Smart Grid Future**
