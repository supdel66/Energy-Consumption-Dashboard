'use client';

import { Leaf } from 'lucide-react';

interface ConsumptionHeaderProps {
    location: string;
    currentLoad: number;
    predictedLoad: number | null;
    status: string | null;
    highTemp: number;
    lowTemp: number;
}

export default function ConsumptionHeader({ 
    location, 
    currentLoad, 
    predictedLoad,
    status,
    highTemp, 
    lowTemp 
}: ConsumptionHeaderProps) {

    const isSaving = currentLoad < 0.5;

    return (
        <div className="text-center px-6">
            {/* Location and Status */}
            <div className="flex flex-col items-center justify-center gap-1 mb-8 mt-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-light">{location || 'Not Connected'}</h1>
                    {location && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-white/80 uppercase tracking-widest">{status || 'ACTIVE'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Consumption vs Predicted */}
            <div className="flex justify-center items-end gap-8 mb-2">
                <div className="text-center">
                   <div className="text-white/60 text-xs mb-1 uppercase tracking-widest">True</div>
                   <div className="text-6xl sm:text-7xl font-thin tracking-tight text-cyan-400">
                       {currentLoad !== undefined && currentLoad !== null ? currentLoad.toFixed(4) : "—"}
                   </div>
                </div>
                <div className="w-px h-16 bg-white/10 mb-2"></div>
                <div className="text-center">
                   <div className="text-white/60 text-xs mb-1 uppercase tracking-widest">Predicted</div>
                   <div className="text-6xl sm:text-7xl font-thin tracking-tight text-purple-400">
                       {predictedLoad !== undefined && predictedLoad !== null ? predictedLoad.toFixed(4) : "—"}
                   </div>
                </div>
            </div>
            <div className="text-xl text-white/60 font-light mb-6">
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
