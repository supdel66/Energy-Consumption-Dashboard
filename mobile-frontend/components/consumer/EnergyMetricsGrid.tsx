'use client';

import { Activity, Clock, Cpu, Gauge, AlertCircle, RefreshCw } from 'lucide-react';

interface EnergyMetricsGridProps {
    mae: number | null;
    lastError: number | null;
    modelVersion: number | null;
    simTime: string | null;
    tickCount: number | null;
    retrainProgress: string | null;
}

export default function EnergyMetricsGrid({ 
    mae, 
    lastError, 
    modelVersion, 
    simTime, 
    tickCount, 
    retrainProgress 
}: EnergyMetricsGridProps) {
    
    const formatTime = (ts: string | null) => {
        if (!ts) return "—";
        const d = new Date(ts.replace(" ", "T"));
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${months[d.getMonth()]} ${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Sim Time */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3 text-white/60 text-xs">
                    <Clock className="w-4 h-4" />
                    <span>SIM TIME</span>
                </div>
                <div className="text-xl font-bold text-white mb-2">{formatTime(simTime)}</div>
                <div className="text-sm text-white/80 mb-3">
                    Tick: {tickCount || 0}
                </div>
            </div>

            {/* Prediction Error */}
            <div className={`p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-all duration-300 ${
                lastError != null && lastError > 0.05 ? 'bg-red-500/20' : 
                lastError != null && lastError > 0.01 ? 'bg-yellow-500/20' : 'bg-green-500/20'
            }`}>
                <div className="flex items-center gap-2 mb-3 text-white/60 text-xs text-white">
                    <AlertCircle className="w-4 h-4" />
                    <span>PREDICTION ERROR</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                    {lastError != null ? lastError.toFixed(4) : "—"}
                </div>
                <div className="text-sm text-white/80">|true - precited| kWh</div>
            </div>

            {/* MAE */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3 text-white/60 text-xs">
                    <Activity className="w-4 h-4" />
                    <span>AVG ERROR (MAE)</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                    {mae != null ? mae.toFixed(4) : "—"}
                </div>
                <div className="text-sm text-white/60">Since session start</div>
            </div>

            {/* Model Version */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3 text-white/60 text-xs">
                    <Cpu className="w-4 h-4" />
                    <span>MODEL VERSION</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">v{modelVersion || 0}</div>
                <div className="text-sm text-white/60">Algorithm</div>
            </div>

            {/* Retrain Progress */}
            <div className="col-span-2 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3 text-white/60 text-xs">
                    <RefreshCw className="w-4 h-4" />
                    <span>RETRAINING PROGRESS</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${retrainProgress ? (parseInt(retrainProgress.split('/')[0])/parseInt(retrainProgress.split('/')[1])) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-xl font-bold text-white">{retrainProgress || "0/0"}</div>
                </div>
                <div className="text-sm text-white/60 mt-2">New data points until next online learning cycle</div>
            </div>

        </div>
    );
}
