import { getCurrentUser } from "@/app/actions/auth";
import SidebarClient from "./SidebarClient";

interface SidebarProps {
    currentPath?: string;
}

export default async function Sidebar({ currentPath = "/dashboard" }: SidebarProps) {
    // Obtener datos reales del usuario en el Servidor
    const user = await getCurrentUser();

    const initials = user?.fullName
        ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";

    return (
        <SidebarClient
            currentPath={currentPath}
            user={user}
            initials={initials}
        />
    );
}
