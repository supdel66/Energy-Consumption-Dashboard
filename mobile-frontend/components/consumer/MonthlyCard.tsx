'use client';

import { useState } from 'react';
import { X, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface MonthlyCardProps {
    value: number; // MWh
}

export default function MonthlyCard({ value }: MonthlyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const percentage = Math.min((value / 5) * 100, 100);
    const strokeDasharray = `${percentage * 2.51}, 251`;

    if (isExpanded) {
        return (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Monthly Usage</h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Large Gauge */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    fill="none"
                                    stroke="url(#monthlyGradient)"
                                    strokeWidth="12"
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="monthlyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-4xl font-bold">{value.toFixed(1)}</div>
                                <div className="text-sm text-white/60">MWATT</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span className="text-white/80">This Month</span>
                            </div>
                            <span className="font-semibold">{value.toFixed(2)} MWh</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-white/80">vs Last Month</span>
                            </div>
                            <span className="font-semibold text-green-400">-12%</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                                <span className="text-white/80">Daily Average</span>
                            </div>
                            <span className="font-semibold">{(value / 30).toFixed(2)} kWh</span>
                        </div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="mt-6 p-4 bg-white/5 rounded-xl">
                        <h3 className="text-sm text-white/60 mb-4">Weekly Breakdown</h3>
                        <div className="flex items-end justify-between gap-2 h-32">
                            {[0.45, 0.52, 0.48, 0.61, 0.55, 0.49, 0.58].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-gradient-to-t from-green-500 to-yellow-500 rounded-t"
                                        style={{ height: `${val * 100}%` }}
                                    />
                                    <div className="text-xs text-white/40">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsExpanded(true)}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
        >
            <div className="text-xs text-white/60 mb-2 text-left">MONTHLY</div>
            <div className="text-[10px] text-white/40 mb-3 text-left">MWATT</div>

            {/* Circular Gauge */}
            <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold">{value.toFixed(1)}</span>
                </div>
            </div>
        </button>
    );
}
