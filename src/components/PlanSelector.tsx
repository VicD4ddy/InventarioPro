"use client";

import { useState } from "react";
import { Crown, Loader2, Check } from "lucide-react";
import { updateBusinessPlan } from "@/app/actions/admin";
import { PLAN_LIMITS, PlanType } from "@/lib/plans";
import { toast } from "sonner";

interface PlanSelectorProps {
    userId: string;
    currentPlan: string;
}

export default function PlanSelector({ userId, currentPlan }: PlanSelectorProps) {
    const [plan, setPlan] = useState(currentPlan);
    const [isPending, setIsPending] = useState(false);

    const handlePlanChange = async (newPlan: string) => {
        setIsPending(true);
        try {
            const result = await updateBusinessPlan(userId, newPlan);
            if (result.success) {
                setPlan(newPlan);
                toast.success(`Plan actualizado a ${PLAN_LIMITS[newPlan as PlanType]?.label || newPlan}`);
            } else {
                toast.error(result.error || "Error al actualizar el plan");
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <select
                    value={plan}
                    disabled={isPending}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all appearance-none disabled:opacity-50"
                >
                    {Object.entries(PLAN_LIMITS).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value.label} (${value.price}/mes)
                        </option>
                    ))}
                </select>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500">
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                </div>
            </div>
            {isPending && (
                <span className="text-[10px] font-black text-blue-500 animate-pulse uppercase tracking-widest">
                    Guardando...
                </span>
            )}
        </div>
    );
}
