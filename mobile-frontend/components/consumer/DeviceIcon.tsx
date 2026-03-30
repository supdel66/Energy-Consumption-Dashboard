'use client';

interface DeviceIconProps {
    type: 'ac' | 'refrigerator' | 'tv' | 'washer' | 'heater' | 'light' | 'fan' | 'microwave';
    className?: string;
    isOn?: boolean;
}

export default function DeviceIcon({ type, className = 'w-8 h-8', isOn = true }: DeviceIconProps) {
    const baseColor = isOn ? 'currentColor' : 'currentColor';
    
    switch (type) {
        case 'ac':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9m6 12V9" />
                    <circle cx="12" cy="6" r="0.5" fill={baseColor} />
                </svg>
            );
        case 'refrigerator':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M5 10h14M8 5v3m0 4v5" />
                </svg>
            );
        case 'tv':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                </svg>
            );
        case 'washer':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <rect x="3" y="2" width="18" height="20" rx="2" />
                    <circle cx="12" cy="14" r="5" />
                    <path d="M7 5h.01M10 5h.01" />
                </svg>
            );
        case 'heater':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <path d="M12 2v20M8 4v16M16 4v16M4 6v12m16-12v12" strokeLinecap="round" />
                </svg>
            );
        case 'light':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    <circle cx="12" cy="12" r="5" />
                </svg>
            );
        case 'fan':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <circle cx="12" cy="12" r="2" fill={baseColor} />
                    <path d="M12 2C8 2 6 6 9 8c-3 2-5 6-1 8-2 3 2 5 4 2 2 3 6 1 4-2 4 2 6-2 4-4 3-2 1-6-2-4 2-4-2-6-4-4z" />
                </svg>
            );
        case 'microwave':
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <rect x="5" y="8" width="10" height="8" rx="1" />
                    <circle cx="18" cy="10" r="1" fill={baseColor} />
                    <circle cx="18" cy="14" r="1" fill={baseColor} />
                </svg>
            );
        default:
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" stroke={baseColor} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            );
    }
}
