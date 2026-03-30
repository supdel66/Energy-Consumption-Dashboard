'use client';

import { useState } from 'react';
import { X, Clock, Calendar, Repeat, Zap } from 'lucide-react';
import DeviceIcon from './DeviceIcon';

interface Device {
    id: string;
    name: string;
    type: 'ac' | 'refrigerator' | 'tv' | 'washer' | 'heater' | 'light' | 'fan' | 'microwave';
    isOn: boolean;
    power: number;
}

interface AddAutomationModalProps {
    devices: Device[];
    onClose: () => void;
}

export default function AddAutomationModal({ devices, onClose }: AddAutomationModalProps) {
    const [selectedDevice, setSelectedDevice] = useState('');
    const [action, setAction] = useState<'on' | 'off'>('on');
    const [time, setTime] = useState('18:00');
    const [days, setDays] = useState<string[]>([]);
    const [isRoutine, setIsRoutine] = useState(true);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (day: string) => {
        setDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const automation = {
            deviceId: selectedDevice,
            action,
            time,
            days: isRoutine ? days : [],
            isRoutine,
        };
        console.log('Automation created:', automation);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-400" />
                        Add Automation
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Device Selection */}
                    <div>
                        <label className="block text-sm text-white/60 mb-3">
                            <Zap className="w-4 h-4 inline mr-1" />
                            Select Device
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {devices.map(device => (
                                <button
                                    key={device.id}
                                    type="button"
                                    onClick={() => setSelectedDevice(device.id)}
                                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                                        selectedDevice === device.id
                                            ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`mb-2 ${selectedDevice === device.id ? 'text-blue-400' : 'text-white/60'}`}>
                                        <DeviceIcon type={device.type} className="w-10 h-10 mx-auto" />
                                    </div>
                                    <div className="text-xs font-medium truncate">{device.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Selection */}
                    <div>
                        <label className="block text-sm text-white/60 mb-3">Action</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAction('on')}
                                className={`p-3 rounded-xl border transition-all ${
                                    action === 'on'
                                        ? 'bg-green-500/20 border-green-500'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                Turn ON
                            </button>
                            <button
                                type="button"
                                onClick={() => setAction('off')}
                                className={`p-3 rounded-xl border transition-all ${
                                    action === 'off'
                                        ? 'bg-red-500/20 border-red-500'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                Turn OFF
                            </button>
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                        <label className="block text-sm text-white/60 mb-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Time
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Routine Toggle */}
                    <div>
                        <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Repeat className="w-5 h-5 text-purple-400" />
                                <span className="text-white/80">Make it routine</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={isRoutine}
                                onChange={(e) => setIsRoutine(e.target.checked)}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500"
                            />
                        </label>
                    </div>

                    {/* Days Selection (if routine) */}
                    {isRoutine && (
                        <div>
                            <label className="block text-sm text-white/60 mb-3">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Repeat on
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${
                                            days.includes(day)
                                                ? 'bg-blue-500/20 border-blue-500'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {selectedDevice && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <div className="text-sm text-blue-400 mb-1 font-medium">Preview</div>
                            <p className="text-white/80 text-sm">
                                {action === 'on' ? 'Turn ON' : 'Turn OFF'}{' '}
                                <span className="font-semibold">
                                    {devices.find(d => d.id === selectedDevice)?.name}
                                </span>{' '}
                                at {time}
                                {isRoutine && days.length > 0 && (
                                    <> every {days.join(', ')}</>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!selectedDevice || (isRoutine && days.length === 0)}
                        className="w-full p-4 bg-blue-500 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        Create Automation
                    </button>
                </form>
            </div>
        </div>
    );
}
