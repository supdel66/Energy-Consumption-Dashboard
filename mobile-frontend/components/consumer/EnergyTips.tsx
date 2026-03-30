'use client';

import { Lightbulb, Leaf, Clock, Zap } from 'lucide-react';

interface EnergyTip {
    id: number;
    icon: 'lightbulb' | 'leaf' | 'clock' | 'zap';
    title: string;
    description: string;
    savings: string;
    color: string;
}

const tips: EnergyTip[] = [
    {
        id: 1,
        icon: 'clock',
        title: 'Use Off-Peak Hours',
        description: 'Run heavy appliances like washing machines between 11 PM - 6 AM to save on electricity costs.',
        savings: 'Save up to 30%',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 2,
        icon: 'leaf',
        title: 'Unplug Idle Devices',
        description: 'Devices on standby still consume power. Unplug chargers and electronics when not in use.',
        savings: 'Save Rs. 200/month',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 3,
        icon: 'lightbulb',
        title: 'Switch to LED Bulbs',
        description: 'LED bulbs use 75% less energy than traditional bulbs and last 25 times longer.',
        savings: 'Save Rs. 500/year',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 4,
        icon: 'zap',
        title: 'Optimize AC Temperature',
        description: 'Set your AC to 24°C instead of 18°C. Every degree higher saves 6% energy.',
        savings: 'Save Rs. 400/month',
        color: 'from-purple-500 to-pink-500'
    }
];

export default function EnergyTips() {
    const getIcon = (iconType: EnergyTip['icon']) => {
        switch (iconType) {
            case 'lightbulb':
                return <Lightbulb className="w-6 h-6" />;
            case 'leaf':
                return <Leaf className="w-6 h-6" />;
            case 'clock':
                return <Clock className="w-6 h-6" />;
            case 'zap':
                return <Zap className="w-6 h-6" />;
        }
    };

    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Energy Saving Tips</h3>
            </div>

            <div className="space-y-3">
                {tips.map((tip) => (
                    <div
                        key={tip.id}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                {getIcon(tip.icon)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        {tip.title}
                                    </h4>
                                    <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full">
                                        {tip.savings}
                                    </span>
                                </div>
                                <p className="text-sm text-white/70">
                                    {tip.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 font-medium">
                View All Tips →
            </button>
        </div>
    );
}
