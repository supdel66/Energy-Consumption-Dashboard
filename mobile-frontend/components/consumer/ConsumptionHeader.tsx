'use client';

import { Leaf } from 'lucide-react';

interface ConsumptionHeaderProps {
    location: string;
    currentLoad: number;
    highTemp: number;
    lowTemp: number;
}

export default function ConsumptionHeader({ 
    location, 
    currentLoad, 
    highTemp, 
    lowTemp 
}: ConsumptionHeaderProps) {

    // Usually between 0 and 1.5 in this simulator
    const isSaving = currentLoad < 0.5;

    return (
        <div className="text-center px-6">
            {/* Location */}
            <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-light">{location || 'Not Connected'}</h1>
                {location && (
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <div className="w-3 h-3 text-green-500">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Current Load */}
            <div className="text-8xl font-thin mb-2 tracking-tight">
                {currentLoad !== undefined && currentLoad !== null ? currentLoad.toFixed(4) : "—"}
            </div>
            <div className="text-2xl text-white/60 font-light -mt-2 mb-4">
                kWh
            </div>

            {/* Saving Energy Badge */}
            {isSaving && currentLoad !== undefined && currentLoad !== null && (
                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-green-400 text-lg font-medium">Low Consumption</span>
                    <Leaf className="w-5 h-5 text-green-400" />
                </div>
            )}

            {/* Temperature Range - Peak High and Low */}
            <div className="text-white/70 text-base mb-6">
                <span className="text-red-400/80">H:{highTemp}°</span>
                {' '}
                <span className="text-blue-400/80">L:{lowTemp}°</span>
            </div>

            {/* Warning Message */}
            <div className="max-w-sm mx-auto">
                <div className="h-px bg-white/20 mb-4" />
                <p className="text-white/60 text-sm leading-relaxed">
                    Check predictions below to optimize your consumption.
                </p>
            </div>
        </div>
    );
}
