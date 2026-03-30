# Pages Overview - BijuliBatti Smart Grid

## All Available Pages

### 1. **Landing Page** (`/`)
- **Purpose**: Marketing/introduction page for the smart grid system
- **Features**:
  - Hero section with call-to-action buttons
  - Feature cards highlighting key capabilities
  - Statistics showcase (42+ meters, 5 blocks, 2 transformers)
  - Navigation to all main pages
- **Design**: Full-page gradient background with glassmorphism cards
- **Tech**: Static page with Lucide icons

### 2. **Dashboard** (`/dashboard`)
- **Purpose**: Main control center with real-time grid monitoring
- **Features**:
  - Interactive Google Maps with zoom-based rendering
    - Transmission lines view (zoom < 14)
    - Blocks view (zoom 14-15.5)
    - Individual meters view (zoom ≥ 15.5)
  - Transformer health panels (click transformer to open)
  - Consumer consumption panels (click meter to open)
  - Real-time notifications dropdown
  - Dynamic pricing display
  - IoT device control panel
  - Consumption charts
- **Components**:
  - GridMap with BlockOverlay and TransmissionLineOverlay
  - TransformerPanel, ConsumerPanel
  - Notifications, PricingDisplay
  - IoTDeviceControl
  - Header with search and user info
  - Sidebar navigation
- **Design**: Full-screen map with overlay panels

### 3. **Analytics** (`/analytics`)
- **Purpose**: Comprehensive data analysis and insights
- **Features**:
  - Key metrics cards (Total Consumption, Cost, Avg Load, Peak Hours)
  - Consumption trend chart (6-month line chart)
  - Transformer load distribution (bar chart)
  - Consumption by consumer type (pie chart)
  - Daily load pattern analysis (line chart)
  - AI-generated insights with color-coded priorities
- **Charts**: Recharts library with custom styling
- **Design**: Grid layout with multiple chart cards
- **Data**: Mock data for demonstration

### 4. **Billing** (`/billing`)
- **Purpose**: View and manage electricity bills and payments
- **Features**:
  - Current billing period summary
    - Current consumption and estimated amount
    - Days remaining indicator
    - Pay Now button (eSewa/Khalti integration ready)
  - Quick stats (Last Payment, Avg Monthly Bill, Payment Method, Next Due Date)
  - Billing history with downloadable invoices
  - Payment method management
  - Bill status indicators (Paid, Pending, Overdue)
- **Design**: Card-based layout with status badges
- **Actions**: Download bills, manage payment methods

### 5. **Reports** (`/reports`)
- **Purpose**: Generate and download detailed reports
- **Features**:
  - Quick statistics (Total Reports, This Month, Downloaded, Scheduled)
  - Advanced filtering (by type and date range)
  - Report types: Consumption, Maintenance, Analytics, Performance, Billing
  - Report history with download buttons
  - Scheduled reports management
  - Report templates for quick generation
- **Report Types**:
  - Monthly Consumption Report
  - Transformer Health Analysis
  - Grid Load Distribution
  - Energy Loss Assessment
  - Peak Hour Analysis
- **Design**: List view with filters and templates section

### 6. **Settings** (`/settings`)
- **Purpose**: Configure user preferences and system settings
- **Sections**:
  - **Profile Information**
    - Name, email, phone, address
    - Editable input fields with icons
  - **Notifications**
    - Email, push, SMS alerts toggles
    - Billing reminders
    - Outage alerts
  - **Smart Automation**
    - Energy optimization toggle
    - Peak hour optimization
    - Daily cost threshold setting
  - **IoT Devices**
    - Automatic device control
    - Connected devices list with status
    - Device configuration options
  - **Security**
    - Change password
    - Two-factor authentication
    - Active sessions management
- **Design**: Stacked sections with toggle switches and input fields
- **Actions**: Save changes button

## Navigation Structure

```
Landing (/)
├── Dashboard (/dashboard)
│   ├── Map view with zoom levels
│   ├── Transformer panels
│   └── Consumer panels
├── Analytics (/analytics)
│   └── Charts and insights
├── Billing (/billing)
│   ├── Current bill
│   └── Payment history
├── Reports (/reports)
│   ├── Generate reports
│   └── Download history
└── Settings (/settings)
    ├── Profile
    ├── Notifications
    ├── Automation
    └── Security
```

## Sidebar Navigation

The sidebar appears on all main pages (Dashboard, Analytics, Billing, Reports, Settings) and includes:
- BijuliBatti logo and branding
- Quick access to all pages
- Active page highlighting
- Logout button at bottom

## Design System

### Color Palette
- **Primary**: Purple (#9333ea) - Transformers, primary actions
- **Secondary**: Blue (#3b82f6) - Accents, secondary actions
- **Accent**: Orange (#f59e0b) - Transmission lines, warnings
- **Success**: Green (#22c55e) - Healthy status, positive metrics
- **Warning**: Orange (#f59e0b) - Warnings, alerts
- **Danger**: Red (#ef4444) - Critical alerts, errors

### Components Used
- **GlassCard**: Glassmorphism card with optional title
- **Charts**: Recharts (LineChart, BarChart, PieChart)
- **Icons**: Lucide React
- **Forms**: Custom styled inputs and toggles
- **Status Badges**: Color-coded with borders

### Responsive Design
- Mobile-first approach
- Grid layouts with responsive columns
- Collapsible sections on mobile
- Touch-friendly buttons and controls

## Mock Data

All pages use mock data from [lib/mock-data.ts](lib/mock-data.ts):
- 2 transformers (TRF-101, TRF-102)
- 42 smart meters distributed across 5 blocks
- 5 blocks with aggregated consumption
- 2 transmission lines
- Historical consumption data
- Billing records
- Report metadata

## Backend Integration Points

When connecting to real backend:

1. **Dashboard**: 
   - `GET /api/v1/transformers` - Transformer data
   - `GET /api/v1/meters` - Smart meter locations
   - `GET /api/v1/blocks` - Block boundaries and consumption
   - `WebSocket` - Real-time updates

2. **Analytics**:
   - `GET /api/v1/analytics/consumption-trend`
   - `GET /api/v1/analytics/transformer-load`
   - `GET /api/v1/analytics/peak-hours`

3. **Billing**:
   - `GET /api/v1/billing/current`
   - `GET /api/v1/billing/history`
   - `POST /api/v1/billing/payment`

4. **Reports**:
   - `GET /api/v1/reports`
   - `POST /api/v1/reports/generate`
   - `GET /api/v1/reports/{id}/download`

5. **Settings**:
   - `GET /api/v1/user/profile`
   - `PUT /api/v1/user/profile`
   - `PUT /api/v1/user/settings`

## Environment Variables Required

```bash
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_MAP_ID=your_map_id

# Backend API
NEXT_PUBLIC_API_URL=http://your-backend:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://your-backend:3001

# Feature Flags
NEXT_PUBLIC_USE_MOCK_DATA=true  # Set to false for production
```

## Performance Optimizations

- Static page generation for landing page
- Client-side rendering for interactive dashboard
- Lazy loading for heavy components (maps, charts)
- Optimized images and assets
- Efficient re-renders with React hooks
- Google Maps clustering for many markers

## Future Enhancements

- User authentication (login/register pages)
- Admin panel for system management
- Mobile app version
- Real-time alerts with sound/vibration
- Advanced ML predictions
- Multi-language support (Nepali/English)
- Dark/light theme toggle
- Export data to CSV/PDF
