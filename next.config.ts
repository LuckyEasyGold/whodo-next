import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    const commonHeaders = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
              "frame-src 'self' https://www.youtube.com https://www.instagram.com https://player.vimeo.com https://w.soundcloud.com",
              "child-src 'self' https://www.youtube.com https://www.instagram.com https://player.vimeo.com"
            ].join('; ')
          }
        ]
      },
    ];

    // Cache agressivo para assets estáticos — aplicado APENAS em produção.
    // Em desenvolvimento o Next.js precisa controlar o Cache-Control desses
    // arquivos internamente; sobrescrevê-lo causa o aviso no terminal.
    const prodHeaders = isProd ? [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ] : [];

    return [...commonHeaders, ...prodHeaders];
  },

  poweredByHeader: false,
};

export default nextConfig;
