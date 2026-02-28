import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas (no requieren sesión)
const PUBLIC_ROUTES = ["/login", "/auth/callback", "/onboarding", "/demo"];
const ADMIN_EMAIL = "admin@gmail.com";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Permitir rutas públicas siempre
    if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Verificar sesión
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Sin sesión → redirigir a /login
    if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirección automática para el Admin si entra a la raíz o al dashboard general
    if (user.email === ADMIN_EMAIL && (pathname === "/" || pathname === "/dashboard")) {
        const adminUrl = request.nextUrl.clone();
        adminUrl.pathname = "/admin";
        return NextResponse.redirect(adminUrl);
    }

    // Proteger /admin
    if (pathname.startsWith("/admin") && user.email !== ADMIN_EMAIL) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        return NextResponse.redirect(dashboardUrl);
    }

    // Inyectar pathname en headers para que los Server Components (Layout/Sidebar) lo lean
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    // Crear la respuesta base con los nuevos headers
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Copiar cookies de la respuesta de Supabase a la respuesta final
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
    });

    return response;
}

export const config = {
    matcher: [
        /*
         * Aplica a todas las rutas EXCEPTO:
         * - _next/static, _next/image, favicon.ico
         * - api routes
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
