'use client';

import { useState, useEffect } from 'react';
import { Plus, PowerOff } from 'lucide-react';
import ConsumptionHeader from '@/components/consumer/ConsumptionHeader';
import HourlyForecast from '@/components/consumer/HourlyForecast';
import AddMeterModal from '@/components/consumer/AddMeterModal';
import WeeklyConsumptionChart from '@/components/consumer/WeeklyConsumptionChart';
import DailyEnergyForecast from '@/components/consumer/DailyEnergyForecast';
import WeeklyEnergyForecast from '@/components/consumer/WeeklyEnergyForecast';
import EnergyMetricsGrid from '@/components/consumer/EnergyMetricsGrid';
import PredictionLogTable from '@/components/consumer/PredictionLogTable';
import ErrorOverTimeChart from '@/components/consumer/ErrorOverTimeChart';

interface DashboardData {
    meter_id: string;
    sim_time: string;
    tick_count: number;
    last_true_kwh: number | null;
    last_predicted_kwh: number | null;
    last_error: number | null;
    model_version: number;
    new_data_since_retrain: number;
    retrain_threshold: number;
    status: string;
    mae: number | null;
    prediction_log: any[];
    predictions_24h: any[];
    predictions_week: any[];
}

export default function ConsumerPage() {
    const [meterId, setMeterId] = useState<string>('');
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [showAddMeter, setShowAddMeter] = useState(true);
    const [isReconnecting, setIsReconnecting] = useState(false);

    useEffect(() => {
        if (!meterId) {
            setShowAddMeter(true);
            return;
        }

        const fetchDashboard = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/dashboard/${meterId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (!data.error) {
                        const filterMidnight = (arr: any[]) => arr ? arr.filter((p: any) => {
                            if (!p || !p.timestamp) return true;
                            const timePart = p.timestamp.split(' ')[1];
                            return !(timePart && timePart.startsWith('00:00'));
                        }) : [];

                        if (data.predictions_24h) data.predictions_24h = filterMidnight(data.predictions_24h);
                        if (data.predictions_week) data.predictions_week = filterMidnight(data.predictions_week);
                        if (data.prediction_log) data.prediction_log = filterMidnight(data.prediction_log);

                        if (data.sim_time && data.sim_time.split(' ')[1]?.startsWith('00:00')) {
                            data.last_predicted_kwh = null;
                            data.last_error = null;
                        }

                        setDashboardData(data);
                        setIsReconnecting(false);
                    }
                } else {
                    setIsReconnecting(true);
                }
            } catch (err) {
                console.error("Dashboard poll error:", err);
                setIsReconnecting(true);
            }
        };

        // Fetch immediately
        fetchDashboard();
        
        // Poll every 3 seconds to get quick UI updates
        const interval = setInterval(fetchDashboard, 3000);
        return () => clearInterval(interval);
    }, [meterId]);

    const handleConnect = (id: string) => {
        setMeterId(id);
        setShowAddMeter(false);
    };

    const handleDisconnect = async () => {
        if (meterId) {
            try {
                await fetch('http://localhost:8000/api/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ meter_id: meterId })
                });
            } catch (e) {}
        }
        setMeterId('');
        setDashboardData(null);
        setShowAddMeter(true);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
            {/* Background Image */}
            <div 
                className="fixed inset-0 w-full h-full opacity-50 bg-cover bg-top-left transition-opacity duration-1000"
                style={{
                    backgroundImage: `url('/Background.png')`,
                    backgroundPosition: 'top left',
                }}
            />

            {/* Content */}
            <div className="relative z-10 pb-20">
                {/* Header with Plus/Disconnect Button */}
                <div className="flex justify-between items-start p-6">
                    <div className="flex-1">
                        {isReconnecting && meterId && (
                            <div className="px-3 py-1 bg-red-500/20 text-red-500 text-xs rounded-full inline-block border border-red-500/30">
                                Reconnecting...
                            </div>
                        )}
                    </div>
                    {meterId ? (
                        <button
                            onClick={handleDisconnect}
                            title="Disconnect Meter"
                            className="w-10 h-10 rounded-full border-2 border-red-500/30 flex items-center justify-center hover:bg-red-500/20 transition-all duration-300 hover:scale-110 active:scale-95 text-red-400"
                        >
                            <PowerOff className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAddMeter(true)}
                            className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-white/10 backdrop-blur-sm"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Consumption Header */}
                <ConsumptionHeader
                    location={meterId || "No Meter"}
                    currentLoad={dashboardData?.last_true_kwh ?? 0}
                    predictedLoad={dashboardData?.last_predicted_kwh ?? null}
                    status={dashboardData?.status ?? null}
                    highTemp={29}
                    lowTemp={15}
                />

                {/* Hourly Forecast */}
                {dashboardData?.predictions_24h && (
                    <HourlyForecast data={dashboardData.predictions_24h} />
                )}

                {/* Weekly / Log Consumption Chart */}
                <div className="px-4 mt-8">
                    <WeeklyConsumptionChart data={dashboardData?.prediction_log || []} />
                </div>

                {/* ML Model Metrics Grid */}
                <div className="px-4 mt-6">
                    <EnergyMetricsGrid 
                        mae={dashboardData?.mae || null}
                        lastError={dashboardData?.last_error || null}
                        modelVersion={dashboardData?.model_version || null}
                        simTime={dashboardData?.sim_time || null}
                        tickCount={dashboardData?.tick_count || null}
                        retrainProgress={dashboardData ? `${dashboardData.new_data_since_retrain}/${dashboardData.retrain_threshold}` : null}
                    />
                </div>

                {/* Daily Forecast */}
                <div className="px-4 mt-6">
                    <DailyEnergyForecast data={dashboardData?.predictions_24h || []} />
                </div>

                {/* Weekly Forecast */}
                <div className="px-4 mt-6">
                    <WeeklyEnergyForecast data={dashboardData?.predictions_week || []} />
                </div>

                {/* Error Over Time Chart */}
                <div className="px-4 mt-6">
                    <ErrorOverTimeChart data={dashboardData?.prediction_log || []} />
                </div>

                {/* Prediction Log Table */}
                <div className="px-4 mt-6 pb-8">
                    <PredictionLogTable data={dashboardData?.prediction_log || []} />
                </div>
            </div>

            {/* Modals */}
            {showAddMeter && (
                <AddMeterModal 
                    onClose={() => {
                        // Allow closing only if we already have a meterId
                        if (meterId) setShowAddMeter(false);
                    }} 
                    onConnect={handleConnect} 
                />
            )}
        </div>
    );
}
