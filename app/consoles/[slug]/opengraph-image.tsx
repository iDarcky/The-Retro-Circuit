import { ImageResponse } from 'next/og';

// Simplified runtime for static image serving
export const runtime = 'edge';

// Image metadata
export const alt = 'The Retro Circuit - Console Specs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  try {
    // Dynamic Base URL
    const getBaseUrl = () => {
      if (process.env.VERCEL_URL) {
        return process.env.VERCEL_URL.startsWith('http')
          ? process.env.VERCEL_URL
          : `https://${process.env.VERCEL_URL}`;
      }
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://theretrocircuit.com';
    };

    const baseUrl = getBaseUrl();
    const imageUrl = `${baseUrl}/og-v2.png`;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#09090b',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="The Retro Circuit"
            width="1200"
            height="630"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error: any) {
    console.error("OpenGraph Static Image Error:", error);
    // Absolute fallback (though if this fails, we are really in trouble)
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#09090b',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: 48,
          }}
        >
          THE RETRO CIRCUIT
        </div>
      ),
      { ...size }
    );
  }
}
