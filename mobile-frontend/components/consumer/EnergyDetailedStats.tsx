'use client';

import { Zap, Wind, Droplets, Gauge, TrendingUp, MapPin, Clock } from 'lucide-react';

interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: string;
    color: string;
}

function StatItem({ icon, label, value, subtitle, color }: StatItemProps) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-white/60 text-xs">
                {icon}
                <span>{label}</span>
            </div>
            <div className={`text-3xl font-bold ${color} mb-1`}>
                {value}
            </div>
            <div className="text-sm text-white/60">{subtitle}</div>
        </div>
    );
}

interface EnergyDetailedStatsProps {
    currentLoad: number;
}

export default function EnergyDetailedStats({ currentLoad }: EnergyDetailedStatsProps) {
    const peakHour = currentLoad > 2000 ? '1AM - 5AM' : '6PM - 10PM';
    const gridStatus = currentLoad < 2000 ? 'Stable' : 'High Demand';
    const powerFactor = (0.92 + Math.random() * 0.06).toFixed(2);
    const costPerKwh = '8.65';
    const carbonOffset = ((currentLoad / 1000) * 0.82).toFixed(1);
    const efficiency = Math.min(Math.round((1 - currentLoad / 5000) * 100), 95);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Peak Hours */}
            <StatItem
                icon={<Clock className="w-4 h-4" />}
                label="PEAK HOURS"
                value={peakHour}
                subtitle="Highest tariff"
                color="text-orange-400"
            />

            {/* Grid Status */}
            <StatItem
                icon={<Gauge className="w-4 h-4" />}
                label="GRID STATUS"
                value={gridStatus}
                subtitle="Real-time"
                color={gridStatus === 'Stable' ? 'text-green-400' : 'text-yellow-400'}
            />

            {/* Power Factor */}
            <StatItem
                icon={<TrendingUp className="w-4 h-4" />}
                label="POWER FACTOR"
                value={powerFactor}
                subtitle="Optimal: >0.95"
                color={parseFloat(powerFactor) > 0.95 ? 'text-green-400' : 'text-yellow-400'}
            />

            {/* Cost per kWh */}
            <StatItem
                icon={<Zap className="w-4 h-4" />}
                label="COST/KWH"
                value={`Rs.${costPerKwh}`}
                subtitle="Current rate"
                color="text-blue-400"
            />

            {/* Carbon Offset */}
            <StatItem
                icon={<Wind className="w-4 h-4" />}
                label="CARBON NOW"
                value={`${carbonOffset}kg`}
                subtitle="CO₂ emissions"
                color="text-purple-400"
            />

            {/* Efficiency */}
            <StatItem
                icon={<Zap className="w-4 h-4" />}
                label="EFFICIENCY"
                value={`${efficiency}%`}
                subtitle="vs target"
                color={efficiency > 85 ? 'text-green-400' : 'text-yellow-400'}
            />
        </div>
    );
}
