"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const DOLAR_API_URL = "https://ve.dolarapi.com/v1/dolares/oficial";

export async function getOfficialRate() {
    try {
        const response = await fetch(DOLAR_API_URL, {
            next: { revalidate: 3600 } // Cache por 1 hora
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la tasa desde DolarAPI");
        }

        const data = await response.json();
        return {
            success: true,
            rate: data.promedio,
            updatedAt: data.fechaActualizacion
        };
    } catch (error) {
        console.error("Error en getOfficialRate:", error);
        return {
            success: false,
            error: "Error al conectar con el servidor de tasas."
        };
    }
}

export async function syncRateWithProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "No autorizado" };

    const apiResult = await getOfficialRate();
    if (!apiResult.success || !apiResult.rate) {
        return { success: false, error: apiResult.error };
    }

    const { error } = await (supabase as any)
        .from("profiles")
        .update({ bcv_rate: apiResult.rate })
        .eq("id", user.id);

    if (error) {
        return { success: false, error: "No se pudo actualizar el perfil" };
    }

    revalidatePath("/dashboard/configuracion");
    return { success: true, rate: apiResult.rate };
}
