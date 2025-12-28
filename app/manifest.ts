import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Retro Circuit',
    short_name: 'Retro Circuit',
    description: 'The ultimate retro gaming hub featuring deep-dive console comparisons and hardware specifications.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#00D9FF',
    icons: [
      {
        src: '/favicon-v2.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
