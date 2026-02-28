import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/SidebarContext";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createClient } from "@/lib/supabase/server";
import { getSystemConfig } from "@/app/actions/admin";
import BroadcastBanner from "@/components/BroadcastBanner";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Verificación de sesión en el layout (doble capa de seguridad junto al middleware)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Verificar si el perfil está completo (primer acceso → onboarding)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("full_name, bcv_rate")
        .eq("id", user.id)
        .single();

    if (!profile?.full_name?.trim()) {
        redirect("/onboarding");
    }

    // Obtener la ruta actual para resaltar el nav activo
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") ?? "/dashboard";

    const config = await getSystemConfig();

    return (
        <SidebarProvider>
            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                <BroadcastBanner config={config as any} />
                <div className="flex flex-1 overflow-hidden">
                    <Toaster richColors position="top-right" />

                    {/* Sidebar con perfil real */}
                    <Sidebar currentPath={pathname} />

                    {/* Área principal */}
                    <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 md:ml-64">
                        <Suspense
                            fallback={
                                <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-3.5 h-[57px]" />
                            }
                        >
                            <TopHeader initialBcvRate={(profile as any)?.bcv_rate || 0} />
                        </Suspense>

                        <Breadcrumbs />

                        {/* Contenido principal scrollable */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
