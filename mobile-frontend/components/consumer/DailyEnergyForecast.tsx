'use client';

import { Zap, Activity } from 'lucide-react';

interface Prediction {
    timestamp: string;
    predicted_kwh: number;
}

interface Props {
    data: Prediction[];
}

export default function DailyEnergyForecast({ data }: Props) {
    if (!data || data.length === 0) return null;

    // Show all 24 hours
    const sampledData = data.slice(0, 24);
    
    // Find max value to calculate percentage relative to max
    const maxKwh = Math.max(...sampledData.map(d => d.predicted_kwh), 0.001);

    const forecastList = sampledData.map(d => {
        const timePart = d.timestamp.split(' ')[1] || '';
        const time = timePart.substring(0, 5) || d.timestamp;
        
        const isHigh = d.predicted_kwh > 0.8; 
        const isLow = d.predicted_kwh < 0.2;
        
        let prediction = 'Low';
        let color = 'bg-blue-500';
        let iconColor = 'text-blue-400';
        
        if (isHigh) {
            prediction = 'High';
            color = 'bg-red-500';
            iconColor = 'text-red-400';
        } else if (!isLow) {
            prediction = 'Medium';
            color = 'bg-yellow-500';
            iconColor = 'text-yellow-500';
        }

        const percentage = Math.min(Math.round((d.predicted_kwh / maxKwh) * 100), 100);

        return {
            time,
            prediction,
            consumption: `${d.predicted_kwh.toFixed(2)} kWh`,
            percentage,
            color,
            iconColor
        };
    });

    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col max-h-[500px]">
            <div className="flex items-center gap-2 mb-4 text-white/60 text-sm">
                <Activity className="w-4 h-4" />
                <span>24-HOUR FORECAST TRENDS</span>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full flex-1">
                {forecastList.map((forecast, index) => (
                    <div key={index} className="flex items-center gap-4 group hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
                        <div className="w-12 text-left">
                            <span className="text-white font-medium">{forecast.time}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                            <Zap className={`w-5 h-5 ${forecast.iconColor}`} />
                            
                            <div className="flex-1">
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${forecast.color} transition-all duration-500 group-hover:scale-105`}
                                        style={{ width: `${forecast.percentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="text-xs text-white/60 w-16 text-right">
                                {forecast.prediction}
                            </div>
                        </div>

                        <div className="text-right w-20">
                            <div className="text-white font-medium">{forecast.consumption}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
