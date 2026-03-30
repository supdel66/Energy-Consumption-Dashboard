'use client';

import { Activity } from 'lucide-react';

interface PredictionLogEntry {
    timestamp: string;
    true_kwh: number | null;
    predicted_kwh: number | null;
    error: number | null;
}

interface Props {
    data: PredictionLogEntry[];
}

export default function PredictionLogTable({ data }: Props) {
    if (!data || data.length === 0) return null;

    // Show latest 30 points, reversed to show newest first
    const rows = [...data].reverse().slice(0, 30);

    const formatTime = (ts: string) => {
        if (!ts) return "—";
        const d = new Date(ts.replace(" ", "T"));
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${months[d.getMonth()]} ${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    };

    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col max-h-[400px]">
            <div className="flex items-center gap-2 mb-4 text-white/60 text-sm">
                <Activity className="w-4 h-4" />
                <span>RECENT PREDICTION LOG</span>
            </div>

            <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full flex-1">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="text-white/60 font-medium sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
                        <tr>
                            <th className="py-2 px-3 border-b border-white/10">Time</th>
                            <th className="py-2 px-3 border-b border-white/10">True</th>
                            <th className="py-2 px-3 border-b border-white/10">Predicted</th>
                            <th className="py-2 px-3 border-b border-white/10">Error</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {rows.map((row, i) => {
                            let errColor = "text-white/80";
                            if (row.error != null) {
                                if (row.error < 0.01) errColor = "text-green-400";
                                else if (row.error < 0.05) errColor = "text-yellow-400";
                                else errColor = "text-red-400";
                            }
                            return (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="py-2 px-3 whitespace-nowrap">{formatTime(row.timestamp)}</td>
                                    <td className="py-2 px-3">{row.true_kwh != null ? row.true_kwh.toFixed(4) : "—"}</td>
                                    <td className="py-2 px-3">{row.predicted_kwh != null ? row.predicted_kwh.toFixed(4) : "—"}</td>
                                    <td className={`py-2 px-3 font-medium ${errColor}`}>
                                        {row.error != null ? row.error.toFixed(4) : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
