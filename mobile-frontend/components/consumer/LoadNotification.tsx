'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Zap, TrendingUp, Clock } from 'lucide-react';

interface Notification {
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
}

interface LoadNotificationProps {
    currentLoad: number;
    previousLoad: number;
    onClose: () => void;
}

export default function LoadNotification({ currentLoad, previousLoad, onClose }: LoadNotificationProps) {
    const [show, setShow] = useState(false);
    const loadIncrease = currentLoad - previousLoad;
    const percentageIncrease = previousLoad > 0 ? (loadIncrease / previousLoad) * 100 : 0;

    useEffect(() => {
        // Show notification only for significant load changes
        if (Math.abs(loadIncrease) > 200) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [loadIncrease, onClose]);

    if (!show) return null;

    const isWarning = currentLoad > 3000 || percentageIncrease > 50;

    return (
        <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 transition-all duration-300 animate-in slide-in-from-top ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
            <div className={`p-4 rounded-2xl backdrop-blur-xl border shadow-xl ${
                isWarning
                    ? 'bg-red-500/10 border-red-500/30 shadow-red-500/20'
                    : loadIncrease > 0
                    ? 'bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/20'
                    : 'bg-green-500/10 border-green-500/30 shadow-green-500/20'
            }`}>
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isWarning
                            ? 'bg-red-500/20'
                            : loadIncrease > 0
                            ? 'bg-yellow-500/20'
                            : 'bg-green-500/20'
                    }`}>
                        {isWarning ? (
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        ) : loadIncrease > 0 ? (
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Zap className="w-5 h-5 text-green-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-semibold ${
                                isWarning
                                    ? 'text-red-400'
                                    : loadIncrease > 0
                                    ? 'text-yellow-400'
                                    : 'text-green-400'
                            }`}>
                                {isWarning
                                    ? 'High Load Warning!'
                                    : loadIncrease > 0
                                    ? 'Load Increased'
                                    : 'Load Decreased'}
                            </h4>
                            <button
                                onClick={() => {
                                    setShow(false);
                                    setTimeout(onClose, 300);
                                }}
                                className="text-white/40 hover:text-white/60 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-white/80 mb-2">
                            {isWarning ? (
                                'Your power consumption is very high. Consider turning off some devices.'
                            ) : loadIncrease > 0 ? (
                                `A device was turned on. Load increased by ${Math.abs(loadIncrease)}W (${percentageIncrease.toFixed(0)}%).`
                            ) : (
                                `A device was turned off. Load decreased by ${Math.abs(loadIncrease)}W.`
                            )}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-white/60">
                            <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Current: {currentLoad}W
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Just now
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
