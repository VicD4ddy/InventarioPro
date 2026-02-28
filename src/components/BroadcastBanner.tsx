"use client";

import { Info, AlertTriangle, AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface BroadcastBannerProps {
    config: {
        global_notification_message: string;
        notification_type: string;
        is_notification_active: boolean;
    };
}

export default function BroadcastBanner({ config }: BroadcastBannerProps) {
    const [isVisible, setIsVisible] = useState(config.is_notification_active && !!config.global_notification_message);

    if (!isVisible) return null;

    const styles = {
        info: "bg-blue-600 text-white",
        warning: "bg-amber-500 text-white",
        error: "bg-rose-600 text-white",
    };

    const icons = {
        info: <Info size={18} />,
        warning: <AlertTriangle size={18} />,
        error: <AlertCircle size={18} />,
    };

    const currentStyle = styles[config.notification_type as keyof typeof styles] || styles.info;
    const currentIcon = icons[config.notification_type as keyof typeof icons] || icons.info;

    return (
        <div className={`w-full ${currentStyle} transition-all duration-500 animate-in slide-in-from-top fill-mode-forwards relative overflow-hidden`}>
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        {currentIcon}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none">
                        {config.global_notification_message}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
