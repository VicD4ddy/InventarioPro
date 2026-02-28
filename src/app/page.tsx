import { redirect } from "next/navigation";

// La raíz redirige según el estado de sesión
// El middleware intercepta antes, pero si llega aquí va al login
export default function Home() {
    redirect("/login");
}
