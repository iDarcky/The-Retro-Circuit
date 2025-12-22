/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/consoles/brand/:slug',
        destination: '/fabricators/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;