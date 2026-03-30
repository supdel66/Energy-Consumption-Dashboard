'use client';

import { useState } from 'react';
import { X, TrendingUp, Leaf, Award, Target } from 'lucide-react';

interface SavingsCardProps {
    value: number; // kWh saved
}

export default function SavingsCard({ value }: SavingsCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const percentage = Math.min((value / 5) * 100, 100);
    const strokeDasharray = `${percentage * 2.51}, 251`;

    const moneySaved = Math.round(value * 8.65); // Rs per kWh

    if (isExpanded) {
        return (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Energy Savings</h2>
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
                                    stroke="url(#savingsGradient)"
                                    strokeWidth="12"
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-4xl font-bold">{value.toFixed(1)}</div>
                                <div className="text-sm text-white/60">kWh</div>
                            </div>
                        </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="space-y-4 mb-6">
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white/60">CO₂ Reduced</div>
                                    <div className="text-xl font-bold">{(value * 0.82).toFixed(1)} kg</div>
                                </div>
                            </div>
                            <div className="text-xs text-white/40">
                                Equivalent to {Math.round(value * 0.82 / 21)} trees planted
                            </div>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white/60">Money Saved</div>
                                    <div className="text-xl font-bold">Rs. {moneySaved}</div>
                                </div>
                            </div>
                            <div className="text-xs text-white/40">
                                This month vs average
                            </div>
                        </div>

                        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white/60">Efficiency Score</div>
                                    <div className="text-xl font-bold">92/100</div>
                                </div>
                            </div>
                            <div className="text-xs text-white/40">
                                Top 10% in your area
                            </div>
                        </div>
                    </div>

                    {/* Goal Progress */}
                    <div className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-white/80">Monthly Goal</span>
                            </div>
                            <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <div className="text-xs text-white/40 mt-2">
                            {value.toFixed(1)} / 5.0 kWh saved
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
            <div className="text-xs text-white/60 mb-2 text-left">SAVINGS</div>
            <div className="text-[10px] text-white/40 mb-3 text-left">KWATT</div>

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
                        stroke="url(#savingsGradientSmall)"
                        strokeWidth="6"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                    <defs>
                        <linearGradient id="savingsGradientSmall" x1="0%" y1="0%" x2="100%" y2="0%">
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
