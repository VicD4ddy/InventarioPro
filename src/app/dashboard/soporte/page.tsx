import { HelpCircle, Mail, MessageSquare, Phone, ExternalLink, ArrowRight } from "lucide-react";

export default function SoportePage() {
    const contactMethods = [
        {
            icon: Mail,
            title: "Correo Electrónico",
            description: "Escríbenos para consultas detalladas",
            value: "soporte@inventariopro.com",
            action: "Enviar email",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: MessageSquare,
            title: "Chat en Vivo",
            description: "Disponible Lun-Vie, 9am - 6pm",
            value: "Respuesta promedio: 5 min",
            action: "Iniciar chat",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            icon: Phone,
            title: "Asistencia Telefónica",
            description: "Solo para planes Enterprise",
            value: "+1 (800) INV-PRO",
            action: "Llamar ahora",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    const faqs = [
        { q: "¿Cómo importo mis productos desde Excel?", a: "Puedes usar nuestro botón de exportación para bajar la plantilla maestra y luego subirla en la sección de carga masiva." },
        { q: "¿Puedo tener múltiples almacenes?", a: "Sí, en el plan Pro y Enterprise puedes gestionar múltiples ubicaciones e inventarios independientes." },
        { q: "¿Cómo recupero un producto eliminado?", a: "Los productos eliminados se archivan. Contacta a un administrador para restaurarlos desde la base de datos de auditoría." }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[30px] bg-blue-600 text-white shadow-2xl shadow-blue-200 mb-2">
                    <HelpCircle size={40} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Centro de Ayuda</h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                    Estamos aquí para ayudarte a optimizar tu inventario. Elige el canal que mejor te funcione.
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method) => (
                    <div key={method.title} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
                        <div className={`w-14 h-14 rounded-2xl ${method.bg} ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-current`}>
                            <method.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 font-medium">{method.description}</p>
                        <p className="text-[13px] font-black text-slate-800 mb-6">{method.value}</p>
                        <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            {method.action}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQs Section */}
            <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <h2 className="text-2xl font-black mb-10 relative z-10 flex items-center gap-3">
                    <ExternalLink className="text-blue-400" />
                    Preguntas Frecuentes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
                    {faqs.map((faq, i) => (
                        <div key={i} className="space-y-3">
                            <h4 className="text-lg font-bold text-blue-400">Q: {faq.q}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <p className="text-slate-400 text-sm font-medium">¿No encuentras lo que buscas?</p>
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                        Visitar Documentación Completa
                    </button>
                </div>
            </div>

            {/* Footer Support Message */}
            <div className="text-center pb-12">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">InventarioPRO Support</p>
                <p className="text-slate-500 text-xs">Versión del Sistema: 1.0.5 - Última actualización: Hoy</p>
            </div>
        </div>
    );
}
