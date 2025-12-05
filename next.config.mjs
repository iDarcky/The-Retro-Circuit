/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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