/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows external images from Supabase/Web
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/console/brand/:slug',
        destination: '/fabricators/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;