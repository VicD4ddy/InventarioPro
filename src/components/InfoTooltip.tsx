"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
    text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1.5 group">
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
            >
                <HelpCircle size={14} />
            </button>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    {text}
                    {/* Flecha del tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
}
