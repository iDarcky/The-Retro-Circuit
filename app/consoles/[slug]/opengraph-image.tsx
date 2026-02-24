import { ImageResponse } from 'next/og';
import { fetchConsoleBySlug } from '@/app/actions/consoles';

// Simplified runtime for static image serving
export const runtime = 'edge';

// Image metadata
export const alt = 'The Retro Circuit - Console Specs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Fetch data
    const { data: consoleData } = await fetchConsoleBySlug(slug, false);

    // Determine Image URL
    let imageUrl = '';

    if (consoleData) {
        // Priority 1: OG Icon
        if (consoleData.og_icon_url) {
            imageUrl = consoleData.og_icon_url;
        }
        // Priority 2: Main Image
        else if (consoleData.image_url) {
            imageUrl = consoleData.image_url;
        }
        // Priority 3: Default Variant Image
        else if (consoleData.variants && consoleData.variants.length > 0) {
             const defaultVar = consoleData.variants.find((v: any) => v.is_default);
             imageUrl = defaultVar?.image_url || consoleData.variants[0].image_url || '';
        }
    }

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

    // Helper to transform Supabase URL for OG
    const transformUrl = (url: string) => {
        if (!url) return '';

        // Handle local paths
        if (url.startsWith('/')) {
            return `${getBaseUrl()}${url}`;
        }

        // Supabase Storage check - force PNG transformation
        if (url.includes('supabase.co/storage/v1/object/public')) {
            // Transform to render endpoint
            let newUrl = url.replace('/object/public/', '/render/image/public/');
            // Append params
            return `${newUrl}?width=600&height=600&resize=contain&format=png`;
        }

        return url;
    };

    const finalUrl = transformUrl(imageUrl);

    // If absolutely no image, fall back to generic
    if (!finalUrl) {
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
                        src={`${getBaseUrl()}/og-v2.png`}
                        alt="The Retro Circuit"
                        width="1200"
                        height="630"
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#09090b', // Deep Black
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Centered Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={finalUrl}
            alt={consoleData?.name || "Console Image"}
            width="600"
            height="600"
            style={{
              objectFit: 'contain',
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
    // Absolute fallback
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
            fontFamily: 'monospace'
          }}
        >
          THE RETRO CIRCUIT
        </div>
      ),
      { ...size }
    );
  }
}
