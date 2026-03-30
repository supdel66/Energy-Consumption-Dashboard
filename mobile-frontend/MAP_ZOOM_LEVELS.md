# Map Zoom Levels Documentation

The smart grid map now features hierarchical zoom-based rendering for better visualization at different scales.

## Zoom Level Behavior

### 1. **Transmission Lines View** (Zoom < 14)
- **What you see**: High-voltage transmission channels across Kathmandu Valley
- **Purpose**: Overview of the entire power distribution network
- **Visual**: Orange transmission lines showing 132kV and 66kV power lines
- **Best for**: Understanding the overall grid infrastructure

### 2. **Blocks View** (Zoom 14-15.5)
- **What you see**: Colored polygons representing neighborhood blocks/areas
- **Features**:
  - Each block is tinted with its transformer's color (Purple for TRF-101, Blue for TRF-102)
  - Total power consumption displayed for each block (e.g., "2800kWh")
  - Hover effects show interactive feedback
- **Purpose**: See consumption patterns by area
- **Best for**: Identifying high-consumption neighborhoods and load distribution

### 3. **Meters View** (Zoom >= 15.5)
- **What you see**: Individual smart meters with real-time consumption
- **Features**:
  - Each meter shows consumption in kWh
  - Color-coded by consumption level (green/yellow/orange/red)
  - Click to see detailed consumer information
- **Purpose**: Monitor individual household/business consumption
- **Best for**: Detailed analysis and individual customer monitoring

## Interactive Features

### Block Click
When you click a block in the Blocks View:
- The map automatically filters to show only meters within that block
- Block name and meter count displayed in top-left corner
- "Back to blocks" button appears to return to block view

### Color Coding
- **Purple blocks/meters**: Served by Transformer 101 (Pepsicola North/Central/South)
- **Blue blocks/meters**: Served by Transformer 102 (Kapoor Garden/Boss Shiv Area)
- This color coding helps operators quickly identify which transformer serves which area

## Current Data Structure

### Blocks
- **BLK-001**: Pepsicola North (8 meters, 2800kWh) - TRF-101
- **BLK-002**: Pepsicola Central (10 meters, 3500kWh) - TRF-101
- **BLK-003**: Pepsicola South (7 meters, 1900kWh) - TRF-101
- **BLK-004**: Kapoor Garden (9 meters, 3200kWh) - TRF-102
- **BLK-005**: Boss Shiv Area (8 meters, 3200kWh) - TRF-102

### Transmission Lines
- **TL-001**: Main Supply Line (132kV)
- **TL-002**: Secondary Supply Line (66kV)

## Technical Implementation

### Data Types
```typescript
interface Block {
    block_id: string;
    name: string;
    transformer_id: string;
    area: string;
    polygon: { lat: number; lng: number }[]; // Geographic boundary
    total_consumption: number; // Aggregated from all meters
    meter_count: number;
    color?: string; // Inherited from transformer
}

interface TransmissionLine {
    line_id: string;
    name: string;
    voltage_kv: number;
    path: { lat: number; lng: number }[]; // Polyline coordinates
    status: 'active' | 'maintenance' | 'inactive';
    color?: string;
}
```

### Zoom Thresholds
```typescript
const ZOOM_LEVELS = {
    TRANSMISSION: 14,  // < 14: Show transmission lines
    BLOCKS: 15.5,      // 14-15.5: Show blocks
    METERS: 15.5       // >= 15.5: Show meters
};
```

### Components
- `GridMap.tsx`: Main map component with zoom detection
- `BlockOverlay`: Custom Google Maps Polygon overlay for blocks
- `TransmissionLineOverlay`: Custom Google Maps Polyline for transmission lines
- `BlockPolygon.tsx`: Standalone block polygon component (alternative implementation)
- `TransmissionLine.tsx`: Standalone transmission line component (alternative implementation)

## Backend Integration

When connecting to the real backend:

### Block Data Endpoint
```
GET /api/v1/blocks
GET /api/v1/blocks/{block_id}
```

### Transmission Line Data Endpoint
```
GET /api/v1/transmission-lines
```

### Update Meter Data Structure
Ensure all meter records include `block_id` field to associate them with blocks.

## Usage Tips

1. **Start zoomed out** to see the overall transmission network
2. **Zoom in** to see block-level consumption patterns
3. **Click a block** to dive into individual meters
4. **Use color coding** to quickly identify transformer service areas
5. **Monitor block totals** for load balancing across transformers

## Future Enhancements

Potential additions:
- Real-time block consumption updates via WebSocket
- Block-level alerts for overload conditions
- Historical consumption trends per block
- Interactive transmission line status indicators
- Power flow animations along transmission lines
- Block comparison tools for load balancing
