'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PowerQualityMapProps {
    currentLoad: number;
}

export default function PowerQualityMap({ currentLoad }: PowerQualityMapProps) {
    // Calculate power quality score (0-100)
    const qualityScore = Math.min(Math.round((1 - currentLoad / 5000) * 100), 100);
    const qualityLevel = qualityScore > 70 ? 'Good' : qualityScore > 40 ? 'Moderate' : 'Poor';
    const qualityColor = qualityScore > 70 ? 'from-green-500 to-yellow-500' : qualityScore > 40 ? 'from-yellow-500 to-orange-500' : 'from-orange-500 to-red-500';

    // Generate grid zones with random quality variations
    const zones = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        quality: Math.max(40, qualityScore + (Math.random() - 0.5) * 20),
    }));

    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-white/60 text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>POWER QUALITY</span>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{qualityScore}</span>
                    <span className="text-white/60">- {qualityLevel}</span>
                </div>
                <p className="text-sm text-white/60">
                    Power quality is {qualityScore}, {qualityLevel.toLowerCase()} conditions in your area.
                </p>
            </div>

            {/* Quality Scale */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div 
                    className={`h-full bg-gradient-to-r ${qualityColor} transition-all duration-500`}
                    style={{ width: `${qualityScore}%` }}
                />
            </div>

            {/* Heat Map */}
            <div className={`relative h-48 rounded-2xl bg-gradient-to-br ${qualityColor} overflow-hidden`}>
                <div className="absolute inset-0 opacity-30">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                        {/* Grid pattern */}
                        {zones.map((zone, i) => {
                            const x = (i % 4) * 100;
                            const y = Math.floor(i / 4) * 66.67;
                            const opacity = zone.quality / 100;
                            return (
                                <rect
                                    key={zone.id}
                                    x={x}
                                    y={y}
                                    width="100"
                                    height="66.67"
                                    fill={`rgba(255, 255, 255, ${opacity * 0.3})`}
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                        {/* Contour lines */}
                        <path
                            d="M50,50 Q150,30 250,60 T350,80"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M30,100 Q180,90 320,110"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M40,150 Q200,140 360,160"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                
                {/* Location Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <div className="text-2xl font-bold text-slate-900">
                                {qualityScore}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black/50 px-2 py-1 rounded">
                            My Location
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full mt-4 flex items-center justify-between text-white/80 hover:text-white transition-colors group">
                <span className="text-sm">See More</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
