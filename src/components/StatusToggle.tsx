"use client";

import { useState, useTransition } from "react";
import { toggleUserStatus } from "@/app/actions/admin";
import { Power, PowerOff, Loader2 } from "lucide-react";

interface StatusToggleProps {
    userId: string;
    initialStatus: boolean;
}

export default function StatusToggle({ userId, initialStatus }: StatusToggleProps) {
    const [isPending, startTransition] = useTransition();
    const [isActive, setIsActive] = useState(initialStatus);

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleUserStatus(userId, isActive);
            if (result.success) {
                setIsActive(!isActive);
            } else {
                alert(result.error || "Error al cambiar el estado");
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            title={isActive ? "Desactivar Cuenta" : "Activar Cuenta"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${isActive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"
                } disabled:opacity-50`}
        >
            {isPending ? (
                <Loader2 size={14} className="animate-spin" />
            ) : isActive ? (
                <Power size={14} />
            ) : (
                <PowerOff size={14} />
            )}
            {isActive ? "Activo" : "Inactivo"}
        </button>
    );
}
