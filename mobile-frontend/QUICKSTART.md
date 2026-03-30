# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Google Maps API key ([Get one here](https://console.cloud.google.com/))

## Setup (2 minutes)

### 1. Clone and Install
```bash
cd bijulibatti
npm install
```

### 2. Configure Environment
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Google Maps API key
# Minimum required:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_MAP_ID=your_map_id_here
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to: **http://localhost:3000/dashboard**

---

## What You'll See

### Dashboard Features
- **Interactive Map**: Google Maps with color-coded meters and transformers
- **Consumer Panel**: Click any meter marker to see consumption details
- **Transformer Panel**: Click transformer markers for health metrics
- **Real-time Updates**: Live data simulation (mock data by default)

### Color Coding
- 🟢 **Green (80-110 kWh)**: Normal consumption
- 🟡 **Yellow (110-120 kWh)**: Warning level  
- 🟠 **Orange (120-130 kWh)**: High consumption
- 🔴 **Red (130+ kWh)**: Critical level

---

## Configuration Options

### Using Mock Data (Development)
```env
# In .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
```
This enables development without a backend server.

### Connecting to Backend
```env
# In .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

---

## Google Maps Setup

### 1. Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API**
4. Create credentials → API Key

### 2. Create Map ID
1. Go to **Map Management** in Google Maps Platform
2. Click **Create Map ID**
3. Choose **Vector** map type
4. Select **Dark** theme (matches UI)
5. Copy the Map ID

### 3. Add to Environment
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_MAP_ID=abc123...
```

---

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Project Structure

```
bijulibatti/
├── app/
│   ├── dashboard/          # Dashboard pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/
│   ├── dashboard/
│   │   ├── Map/           # Map components
│   │   ├── Widgets/       # Charts & metrics
│   │   ├── ConsumerPanel.tsx
│   │   ├── TransformerPanel.tsx
│   │   ├── Notifications.tsx
│   │   ├── PricingDisplay.tsx
│   │   └── IoTDeviceControl.tsx
│   └── shared/            # Reusable components
│
├── lib/
│   ├── api-client.ts      # Backend API client
│   ├── websocket-client.ts # WebSocket client
│   ├── types.ts           # TypeScript types
│   └── mock-data.ts       # Development data
│
├── .env.example           # Environment template
└── .env.local            # Your config (create this)
```

---

## Troubleshooting

### Map Not Loading
❌ **Error**: Blank map or "For development purposes only"
✅ **Fix**: Check your `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`

### API Errors
❌ **Error**: "Failed to fetch" in console
✅ **Fix**: 
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Ensure backend is running
3. Or enable mock data: `NEXT_PUBLIC_USE_MOCK_DATA=true`

### Build Errors
❌ **Error**: TypeScript compilation errors
✅ **Fix**: Run `npm install` to ensure all dependencies are installed

### Port Already in Use
❌ **Error**: Port 3000 is already in use
✅ **Fix**: Kill the process or change port:
```bash
PORT=3001 npm run dev
```

---

## Next Steps

1. **Test with Mock Data**: Explore the UI with simulated data
2. **Read API Spec**: See `BACKEND_API_SPEC.md` for backend integration
3. **Connect Backend**: Update `.env.local` with your backend URLs
4. **Customize**: Modify components in `components/dashboard/`

---

## Documentation

- 📖 **Full Guide**: [FRONTEND_README.md](./FRONTEND_README.md)
- 🔌 **API Specification**: [BACKEND_API_SPEC.md](./BACKEND_API_SPEC.md)
- 📋 **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## Support

**Issues?** Check the troubleshooting section above or refer to the detailed documentation.

**Questions?** Review `FRONTEND_README.md` for comprehensive information.

---

✅ **You're all set! Happy coding! 🎉**
