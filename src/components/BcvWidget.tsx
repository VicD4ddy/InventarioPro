"use client";

import { useEffect, useState, useTransition } from "react";
import { RefreshCcw, Landmark } from "lucide-react";
import { getOfficialRate, syncRateWithProfile } from "@/app/actions/exchange";
import { toast } from "sonner";

interface BcvWidgetProps {
    initialRate: number;
}

export default function BcvWidget({ initialRate }: BcvWidgetProps) {
    const [rate, setRate] = useState(initialRate);
    const [isPending, startTransition] = useTransition();

    const handleSync = () => {
        startTransition(async () => {
            const result = await syncRateWithProfile();
            if (result.success && result.rate) {
                setRate(result.rate);
                toast.success(`Tasa BCV actualizada: ${result.rate} Bs/USD`);
            } else {
                toast.error("No se pudo sincronizar la tasa");
            }
        });
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl group hover:bg-white hover:shadow-sm transition-all">
            <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                    <Landmark size={12} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">BCV</span>
                    <span className="text-xs font-black text-slate-700 leading-tight">
                        {rate > 0 ? `${rate.toLocaleString("es", { minimumFractionDigits: 2 })} Bs` : "Sin tasa"}
                    </span>
                </div>
            </div>

            <button
                onClick={handleSync}
                disabled={isPending}
                className={`p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors ${isPending ? 'animate-spin' : ''}`}
                title="Sincronizar con DolarAPI"
            >
                <RefreshCcw size={12} />
            </button>
        </div>
    );
}
