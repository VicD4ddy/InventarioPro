"use client";

import { useState } from "react";
import {
    Mail,
    Phone,
    Globe,
    MoreVertical,
    Edit2,
    Trash2,
    Search,
    Plus,
    Building2,
    MapPin,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import type { Supplier } from "@/lib/supabase/types";
import SupplierModal from "./SupplierModal";
import { deleteSupplier } from "@/app/actions/suppliers";
import { useRouter } from "next/navigation";

interface SuppliersTableProps {
    suppliers: Supplier[];
}

export default function SuppliersTable({ suppliers }: SuppliersTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const router = useRouter();

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsModalOpen(true);
        setActionMenuOpen(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
            const result = await deleteSupplier(id);
            if (result.success) {
                toast.success("Proveedor eliminado correctamente");
                router.refresh();
            } else {
                toast.error(result.error || "Error al eliminar proveedor");
            }
        }
        setActionMenuOpen(null);
    };

    const openCreate = () => {
        setSelectedSupplier(undefined);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:max-w-md group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o país..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all"
                    />
                </div>

                <button
                    onClick={openCreate}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Añadir Proveedor
                </button>
            </div>

            {/* Grid de Proveedores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuppliers.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-slate-100 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Building2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No hay proveedores</h3>
                        <p className="text-slate-400 text-sm mt-1">Comienza añadiendo tu primer contacto comercial.</p>
                    </div>
                ) : (
                    filteredSuppliers.map((supplier) => (
                        <div key={supplier.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group relative overflow-hidden">
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-50 transition-colors duration-500" />

                            <div className="relative">
                                {/* Header del Card */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-lg transition-all duration-300">
                                        <Building2 size={28} />
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setActionMenuOpen(actionMenuOpen === supplier.id ? null : supplier.id)}
                                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {actionMenuOpen === supplier.id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all text-left"
                                                >
                                                    <Edit2 size={16} /> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(supplier.id)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                                                >
                                                    <Trash2 size={16} /> Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Información Principal */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 truncate">
                                        {supplier.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        <MapPin size={12} className="text-blue-500" />
                                        {supplier.country || "Ubicación no especificada"}
                                    </div>
                                </div>

                                {/* Datos de Contacto */}
                                <div className="space-y-3 pt-6 border-t border-slate-50">
                                    {supplier.email && (
                                        <a href={`mailto:${supplier.email}`} className="flex items-center gap-3 text-sm text-slate-500 hover:text-blue-600 transition-colors group/link">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/link:bg-blue-50 transition-colors">
                                                <Mail size={14} />
                                            </div>
                                            <span className="truncate font-medium">{supplier.email}</span>
                                        </a>
                                    )}
                                    {supplier.phone && (
                                        <a href={`tel:${supplier.phone}`} className="flex items-center gap-3 text-sm text-slate-500 hover:text-emerald-600 transition-colors group/link">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/link:bg-emerald-50 transition-colors">
                                                <Phone size={14} />
                                            </div>
                                            <span className="font-medium">{supplier.phone}</span>
                                        </a>
                                    )}
                                    {!supplier.email && !supplier.phone && (
                                        <p className="text-xs text-slate-400 italic py-2">Sin datos de contacto registrados</p>
                                    )}
                                </div>

                                {/* Acción Footer */}
                                <div className="mt-6 pt-4">
                                    <button
                                        onClick={() => handleEdit(supplier)}
                                        className="w-full py-3 rounded-2xl bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                    >
                                        Gestionar Proveedor
                                        <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de CRUD */}
            {isModalOpen && (
                <SupplierModal
                    supplier={selectedSupplier}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
