'use client';

import { useState } from 'react';
import { X, Zap, Hash } from 'lucide-react';

interface AddMeterModalProps {
    onClose: () => void;
    onConnect: (meterId: string) => void;
}

export default function AddMeterModal({ onClose, onConnect }: AddMeterModalProps) {
    const [meterId, setMeterId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!meterId.trim()) {
            setError('Meter ID is required');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meter_id: meterId.trim() })
            });
            
            if (!res.ok) {
                throw new Error('Failed to connect to backend');
            }
            
            const data = await res.json();
            
            if (data.error) {
                setError(data.error);
            } else {
                onConnect(data.meter_id);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to connect to backend server. Is it running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        Connect Smart Meter
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Meter ID */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">
                            <Hash className="w-4 h-4 inline mr-1" />
                            Meter ID
                        </label>
                        <input
                            type="text"
                            value={meterId}
                            onChange={(e) => setMeterId(e.target.value)}
                            placeholder="e.g., M001"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Connection Info */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <p className="text-xs text-white/60">
                            Connecting to local Python simulator on port 8000. Use any valid ID (e.g. M001).
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 bg-blue-500 rounded-xl font-semibold hover:bg-blue-600 transition-colors mt-6 disabled:opacity-50 flex justify-center items-center"
                    >
                        {loading ? 'Connecting...' : 'Connect'}
                    </button>
                </form>
            </div>
        </div>
    );
}
