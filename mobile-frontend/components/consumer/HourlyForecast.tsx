'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';

interface Prediction {
    timestamp: string;
    predicted_kwh: number;
}

interface Props {
    data: Prediction[];
}

export default function HourlyForecast({ data }: Props) {
    // Only take the next 5 hours
    const forecast = data.slice(0, 5).map((d, index) => {
        // Parse time out of timestamp e.g. '2025-01-01 10:00:00' -> '10:00'
        const timePart = d.timestamp.split(' ')[1] || '';
        const time = timePart.substring(0, 5) || d.timestamp;
        
        // simple high indicator for UI
        const isHigh = d.predicted_kwh > 0.8; // arbitrary threshold

        return {
            time: index === 0 ? 'Now' : time,
            value: d.predicted_kwh,
            isHigh
        };
    });

    if (forecast.length === 0) return null;

    return (
        <div className="px-6 mt-8">
            <div className="flex justify-between items-end">
                {forecast.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 transition-all duration-500 hover:scale-110">
                        {/* Time */}
                        <div className="text-white/60 text-xs font-medium mb-1">
                            {item.time}
                        </div>

                        {/* Indicator */}
                        <div className={`${item.isHigh ? 'text-red-500' : 'text-green-500'}`}>
                            {item.isHigh ? (
                                <ChevronUp className="w-6 h-6 fill-current" />
                            ) : (
                                <ChevronDown className="w-6 h-6 fill-current" />
                            )}
                        </div>

                        {/* Value */}
                        <div className="text-white text-lg font-light">
                            {item.value.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
