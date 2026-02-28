import { getAllUsers } from "@/app/actions/admin";
import { Users, Mail, Shield, UserCheck, Search, Filter, MoreHorizontal } from "lucide-react";
import StatusToggle from "@/components/StatusToggle";

export default async function AdminUsuariosPage() {
    const users = (await getAllUsers()) as any[];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de la Sección */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users size={32} className="text-blue-600" />
                        Directorio de Usuarios
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Administra todos los accesos y perfiles registrados en la plataforma.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Usuario</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contacto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rol</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha Registro</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name || ""} className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm">
                                                    {(user.full_name || "?")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {user.full_name || "Usuario sin nombre"}
                                                </span>
                                                {user.email === 'admin@gmail.com' && (
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">Admin Global</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Mail size={14} className="text-slate-400" />
                                            <span className="text-xs font-medium">{user.email || "Sin correo"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.email === 'admin@gmail.com'
                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                            : 'bg-slate-50 text-slate-400 border-slate-100'
                                            }`}>
                                            <Shield size={10} />
                                            {user.email === 'admin@gmail.com' ? 'Superadmin' : 'Miembro'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusToggle userId={user.id} initialStatus={user.is_active ?? true} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <UserCheck size={14} className="text-slate-400" />
                                            <span className="text-xs font-medium">
                                                {new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-400 italic">
                        El acceso de administrador está restringido mediante middleware de seguridad.
                    </p>
                </div>
            </div>
        </div>
    );
}
