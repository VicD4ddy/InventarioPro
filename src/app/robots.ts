import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://inventariopro.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/login', '/registro', '/demo'],
                disallow: ['/dashboard/', '/admin/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
