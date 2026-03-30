'use client';

import { useState } from 'react';
import { Plus, X, Power, Clock, Zap } from 'lucide-react';
import DeviceIcon from './DeviceIcon';

interface Device {
    id: string;
    name: string;
    type: 'ac' | 'refrigerator' | 'tv' | 'washer' | 'heater' | 'light' | 'fan' | 'microwave';
    isOn: boolean;
    power: number;
}

interface DevicesCardProps {
    devices: Device[];
    onToggle: (id: string) => void;
    onAddAutomation: () => void;
}

export default function DevicesCard({ devices, onToggle, onAddAutomation }: DevicesCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const onDevices = devices.filter(d => d.isOn);
    const offDevices = devices.filter(d => !d.isOn);

    if (isExpanded) {
        return (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className="w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-black/95 pb-4">
                        <h2 className="text-2xl font-semibold">Devices</h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Add Automation Button */}
                    <button
                        onClick={() => {
                            setIsExpanded(false);
                            onAddAutomation();
                        }}
                        className="w-full mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-colors"
                    >
                        <Clock className="w-5 h-5" />
                        <span>Add Automation</span>
                    </button>

                    {/* On Devices */}
                    <div className="mb-6">
                        <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            ON ({onDevices.length})
                        </h3>
                        <div className="space-y-2">
                            {onDevices.map(device => (
                                <div
                                    key={device.id}
                                    className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between transition-all duration-300 hover:bg-green-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-green-400">
                                            <DeviceIcon type={device.type} className="w-8 h-8" isOn={true} />
                                        </div>
                                        <div>
                                            <div className="font-medium">{device.name}</div>
                                            <div className="text-xs text-white/60 flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                {device.power}W
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onToggle(device.id)}
                                        className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-all duration-300 hover:scale-110 active:scale-95"
                                    >
                                        <Power className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Off Devices */}
                    <div>
                        <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/40" />
                            OFF ({offDevices.length})
                        </h3>
                        <div className="space-y-2">
                            {offDevices.map(device => (
                                <div
                                    key={device.id}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between opacity-60 transition-all duration-300 hover:opacity-80 hover:bg-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-white/40">
                                            <DeviceIcon type={device.type} className="w-8 h-8" isOn={false} />
                                        </div>
                                        <div>
                                            <div className="font-medium">{device.name}</div>
                                            <div className="text-xs text-white/40 flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                {device.power}W
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onToggle(device.id)}
                                        className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
                                    >
                                        <Power className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5">
            <div className="text-xs text-white/60 mb-3">DEVICES</div>

            {/* Device Icons */}
            <div className="grid grid-cols-2 gap-3">
                {devices.slice(0, 3).map(device => (
                    <button
                        key={device.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(device.id);
                        }}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                            device.isOn
                                ? 'bg-green-500/20 border border-green-500/50 shadow-lg shadow-green-500/20 text-green-400'
                                : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                    >
                        <DeviceIcon type={device.type} className="w-10 h-10" isOn={device.isOn} />
                    </button>
                ))}

                {/* Plus Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(true);
                    }}
                    className="aspect-square rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/20"
                >
                    <Plus className="w-8 h-8 text-blue-400" />
                </button>
            </div>
        </div>
    );
}
