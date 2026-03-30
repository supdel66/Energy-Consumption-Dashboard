'use client';

import { useState } from 'react';
import { X, DollarSign, Calendar, TrendingDown, FileText } from 'lucide-react';

interface BillCardProps {
    amount: number;
}

export default function BillCard({ amount }: BillCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 0,
        }).format(val).replace('NPR', 'Rs.');
    };

    if (isExpanded) {
        return (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Bill Details</h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Current Bill */}
                    <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl mb-6">
                        <div className="text-sm text-white/60 mb-2">Current Month</div>
                        <div className="text-5xl font-bold mb-2">{formatCurrency(amount)}</div>
                        <div className="text-sm text-white/80">Due: Feb 15, 2026</div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3 mb-6">
                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/80">Energy Charges</span>
                                <span className="font-semibold">Rs. 3,200</span>
                            </div>
                            <div className="text-xs text-white/40">3.7 MWh × Rs. 865/MWh</div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/80">Service Charge</span>
                                <span className="font-semibold">Rs. 450</span>
                            </div>
                            <div className="text-xs text-white/40">Fixed monthly fee</div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/80">Meter Rent</span>
                                <span className="font-semibold">Rs. 150</span>
                            </div>
                            <div className="text-xs text-white/40">Smart meter rental</div>
                        </div>

                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-green-400">Discount</span>
                                <span className="font-semibold text-green-400">- Rs. 200</span>
                            </div>
                            <div className="text-xs text-green-400/60">Energy saving bonus</div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/80">Tax (13%)</span>
                                <span className="font-semibold">Rs. 400</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-4 h-4 text-green-400" />
                                <span className="text-xs text-white/60">vs Last Month</span>
                            </div>
                            <div className="text-xl font-bold text-green-400">-8%</div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-white/60">Avg Daily</span>
                            </div>
                            <div className="text-xl font-bold">Rs. 133</div>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button className="w-full mt-6 p-4 bg-blue-500 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                        Pay Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsExpanded(true)}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
        >
            <div className="text-xs text-white/60 mb-2 text-left">BILL</div>
            <div className="text-[10px] text-white/40 mb-6 text-left">RUPEES</div>

            <div className="text-left">
                <div className="text-3xl font-bold mb-1">
                    {amount.toLocaleString('en-NP')}
                </div>
                <div className="text-xs text-white/40">Current month</div>
            </div>
        </button>
    );
}
