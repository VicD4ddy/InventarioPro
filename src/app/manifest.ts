import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'InventarioPRO — Gestión de Inventario',
        short_name: 'InventarioPRO',
        description: 'La plataforma definitiva para la gestión de inventario empresarial.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a', // slate-900
        theme_color: '#2563eb', // blue-600
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
