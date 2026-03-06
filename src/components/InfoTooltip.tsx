"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
    text: string;
    position?: "top" | "bottom" | "left" | "right";
}

export default function InfoTooltip({ text, position = "top" }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    let popupClasses = "";
    let arrowClasses = "";

    switch (position) {
        case "bottom":
            popupClasses = "top-full left-1/2 -translate-x-1/2 mt-2";
            arrowClasses = "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-slate-900";
            break;
        case "left":
            popupClasses = "right-full top-1/2 -translate-y-1/2 mr-2";
            arrowClasses = "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-slate-900";
            break;
        case "right":
            popupClasses = "left-full top-1/2 -translate-y-1/2 ml-2";
            arrowClasses = "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-slate-900";
            break;
        case "top":
        default:
            popupClasses = "bottom-full left-1/2 -translate-x-1/2 mb-2";
            arrowClasses = "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-slate-900";
            break;
    }

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
                <div className={`absolute ${popupClasses} w-48 p-2.5 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-none`}>
                    {text}
                    {/* Flecha del tooltip */}
                    <div className={`absolute border-4 border-transparent ${arrowClasses}`} />
                </div>
            )}
        </div>
    );
}
