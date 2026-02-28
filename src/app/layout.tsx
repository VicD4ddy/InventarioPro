import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "InventarioPRO — Gestión de Inventario Inteligente",
        template: "%s | InventarioPRO"
    },
    description: "La plataforma definitiva para la gestión de inventario empresarial. Controla stock, proveedores y ventas en tiempo real con una interfaz premium.",
    keywords: ["inventario", "gestión de stock", "ERP", "punto de venta", "POS", "negocios", "administración"],
    authors: [{ name: "InventarioPRO Team" }],
    creator: "InventarioPRO",
    publisher: "InventarioPRO",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: "https://inventariopro.com",
        siteName: "InventarioPRO",
        title: "InventarioPRO — Potencia tu negocio",
        description: "Sistema avanzado de gestión de inventario para empresas modernas.",
        images: [
            {
                url: "/og-image.png", // Asumimos que existe o se creará
                width: 1200,
                height: 630,
                alt: "InventarioPRO Dashboard",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "InventarioPRO — Control Total",
        description: "Gestiona tu inventario como un profesional.",
        images: ["/twitter-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es">
            <body className={`${inter.variable} antialiased`}>{children}</body>
        </html>
    );
}
