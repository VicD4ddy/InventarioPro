import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

// Singleton para evitar múltiples instancias en el navegador
let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient<T = Database>() {
    if (client) return client as unknown as ReturnType<typeof createBrowserClient<T>>;

    client = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    return client as unknown as ReturnType<typeof createBrowserClient<T>>;
}
