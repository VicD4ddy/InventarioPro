"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Package, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications";
import type { Notification } from "@/lib/supabase/types";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data as any);
    };

    useEffect(() => {
        fetchNotifications();
        // Polling cada 30 segundos para nuevas notificaciones (opcional)
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
        fetchNotifications();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notificaciones"
            >
                <Bell size={16} className={unreadCount > 0 ? "text-blue-600" : "text-slate-600"} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                            >
                                Marcar todo
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell size={20} className="text-slate-300" />
                                </div>
                                <p className="text-xs text-slate-400 font-medium px-6 italic">No tienes notificaciones pendientes.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-4 flex gap-3 group hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-blue-50/20' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'warning' ? 'bg-orange-50 text-orange-500' :
                                                n.type === 'error' ? 'bg-red-50 text-red-500' :
                                                    'bg-blue-50 text-blue-500'
                                            }`}>
                                            {n.type === 'warning' ? <AlertTriangle size={14} /> :
                                                n.type === 'error' ? <AlertTriangle size={14} /> :
                                                    <Package size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-xs leading-snug ${!n.is_read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                                                    {n.title}
                                                </p>
                                                {!n.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(n.id)}
                                                        className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"
                                                        title="Marcar como leída"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                {n.message}
                                            </p>
                                            <p className="text-[9px] text-slate-300 mt-1.5 font-bold uppercase">
                                                {new Date(n.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
