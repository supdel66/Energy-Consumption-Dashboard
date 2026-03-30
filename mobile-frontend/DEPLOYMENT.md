# Bijulibatti - Smart Grid Management System

## Production Deployment Guide

### Overview
A real-time smart grid monitoring and management system for Nepal's electricity distribution network with dynamic pricing, IoT device control, and geographic visualization.

### System Architecture

#### Core Components
1. **Frontend**: Next.js 14 (React Server Components + Client Components)
2. **Maps**: Google Maps Platform with custom overlays
3. **Real-time**: WebSocket connections for live data
4. **Storage**: Browser localStorage (client-side persistence)
5. **Styling**: Tailwind CSS with glassmorphism design

#### Key Features
- **Smart Meter Management**: Real-time consumption monitoring (69 kWh/month average)
- **Transformer Monitoring**: Health tracking, load management, temperature monitoring
- **Hydropower Integration**: Generation tracking and substation connections
- **Dynamic Pricing**: Load-based rate adjustments (₹9.5-11.4/kWh)
- **Geographic Visualization**: Interactive map with transmission line topology
- **Solar Panel Integration**: Track household solar generation
- **Block Management**: Area-based consumption aggregation

### Data Model

#### Consumption Distribution (Nepal-specific)
- 45% Low usage (0-20 kWh/month): Basic lighting/TV
- 40% Mid-range (21-100 kWh/month): Urban households  
- 15% High usage (101-150 kWh/month): Heavy appliances
- National average: 69 kWh/month

#### Power Grid Topology
- **Hydropower → Substation**: 220 kV (Green lines)
- **Substation → Transformer**: 132 kV (Orange lines)
- **Transformer ↔ Transformer**: 33 kV chains, max 2 connections (Violet lines)

### Environment Setup

#### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

#### Google Maps API Setup
1. Enable Google Maps JavaScript API
2. Enable Maps Platform APIs
3. Create Map ID with light theme styling
4. Current Map ID: `a13d8989fba2d60`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Production Considerations

#### Performance Optimization
- Use Next.js Image optimization for assets
- Implement server-side rendering where appropriate
- Enable compression and caching
- Lazy load map markers for large datasets

#### Data Persistence
Current: Browser localStorage (client-side)

**For Production, implement:**
- PostgreSQL/MongoDB for persistent storage
- Redis for real-time caching
- WebSocket server for live updates
- API layer (REST/GraphQL)

#### Security
- Implement authentication (NextAuth.js recommended)
- Add role-based access control
- Secure API endpoints
- Rate limiting
- Input validation

#### Monitoring
- Add error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Real-time meter health checks
- Transformer temperature alerts

### API Endpoints to Implement

```typescript
// Recommended backend API structure
POST /api/meters/create
GET /api/meters/:id
PUT /api/meters/:id/reading
DELETE /api/meters/:id

POST /api/transformers/create
GET /api/transformers/:id
PUT /api/transformers/:id/status
GET /api/transformers/:id/health

POST /api/hydropower/create
GET /api/hydropower/:id
PUT /api/hydropower/:id/generation

GET /api/pricing/current
GET /api/pricing/forecast

WebSocket /ws/realtime
- meter-reading
- transformer-health
- pricing-update
- grid-alert
```

### Database Schema

```sql
-- Recommended PostgreSQL schema
CREATE TABLE smart_meters (
    meter_id VARCHAR(50) PRIMARY KEY,
    consumer_id VARCHAR(50),
    transformer_id VARCHAR(50),
    block_id VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20),
    has_solar BOOLEAN,
    solar_capacity_kw DECIMAL(5, 2),
    installation_date TIMESTAMP,
    last_heartbeat TIMESTAMP
);

CREATE TABLE transformers (
    transformer_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity_kva INTEGER,
    voltage_rating VARCHAR(20),
    status VARCHAR(20),
    health_score INTEGER,
    load_percentage DECIMAL(5, 2),
    temperature DECIMAL(5, 2),
    color VARCHAR(7)
);

CREATE TABLE hydropower (
    hydropower_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity_mw DECIMAL(8, 2),
    current_generation_mw DECIMAL(8, 2),
    status VARCHAR(20),
    efficiency INTEGER
);

CREATE TABLE consumption_readings (
    reading_id UUID PRIMARY KEY,
    meter_id VARCHAR(50),
    timestamp TIMESTAMP,
    consumption_kwh DECIMAL(10, 2),
    voltage DECIMAL(6, 2),
    current DECIMAL(6, 2),
    power_factor DECIMAL(3, 2)
);

CREATE INDEX idx_readings_meter ON consumption_readings(meter_id, timestamp);
CREATE INDEX idx_meters_transformer ON smart_meters(transformer_id);
```

### Deployment Platforms

#### Recommended: Vercel
```bash
vercel --prod
```

#### Alternative: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Alternative: Traditional Server
```bash
# PM2 process manager
pm2 start npm --name "bijulibatti" -- start
pm2 save
pm2 startup
```

### Monitoring & Alerts

```typescript
// Implement alert thresholds
const ALERTS = {
  TRANSFORMER_OVERLOAD: 90, // %
  TRANSFORMER_CRITICAL: 95, // %
  HIGH_TEMPERATURE: 60, // °C
  METER_OFFLINE: 300, // seconds
  CONSUMPTION_SPIKE: 150 // kWh
};
```

### Backup Strategy
- Daily database backups
- Hourly meter reading snapshots
- Configuration version control
- Disaster recovery plan

### Scalability Considerations
- Horizontal scaling for API servers
- Read replicas for database
- CDN for static assets
- Message queue for async processing
- Microservices architecture for large deployments

### Nepal-Specific Considerations
- NEA tariff integration
- Load shedding schedule handling
- Multiple voltage standards (11kV, 33kV, 220kV)
- Local time zone (Asia/Kathmandu)
- NPR currency formatting

### Support & Maintenance
- Monitor Nepal Electricity Authority (NEA) API updates
- Regular security patches
- Performance optimization reviews
- User feedback integration
- Documentation updates

---

**Current Status**: Development/Demo Ready
**Production Ready**: Requires backend implementation as outlined above
**License**: Proprietary
**Contact**: Configure in package.json
