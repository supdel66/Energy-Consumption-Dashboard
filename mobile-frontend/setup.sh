#!/bin/bash

# Setup script for Bijulibatti Smart Grid Frontend

echo "🔌 Setting up Bijulibatti Smart Grid Frontend..."
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✓ .env.local already exists"
else
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Please update .env.local with your actual values:"
    echo "   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
    echo "   - NEXT_PUBLIC_MAP_ID"
    echo "   - NEXT_PUBLIC_API_URL (your backend URL)"
    echo "   - NEXT_PUBLIC_WS_URL (your WebSocket URL)"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your Google Maps API key"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000/dashboard in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Frontend Guide: FRONTEND_README.md"
echo "   - Backend API Spec: BACKEND_API_SPEC.md"
echo "   - Implementation Summary: IMPLEMENTATION_SUMMARY.md"
