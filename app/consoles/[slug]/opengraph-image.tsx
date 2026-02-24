import { ImageResponse } from 'next/og';
import { fetchConsoleBySlug } from '../../../app/actions';

// Removed Edge runtime as it causes instability with database/font fetches
// export const runtime = 'edge';

// Image metadata
export const alt = 'The Retro Circuit - Console Specs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Font URL (Press Start 2P from Google Fonts)
// We use a direct TTF link if possible or fallback to standard sans
const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/PressStart2P-Regular.ttf';

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    // 1. Fetch Data
    const slug = decodeURIComponent(params.slug);
    const { data: consoleData } = await fetchConsoleBySlug(slug, false);

    // 2. Fallback Data
    if (!consoleData) {
      throw new Error("Console not found");
    }

    // 3. Extract Specs & Image (Similar logic to Metadata)
    let finalImage = consoleData.image_url;
    let defaultVar = null;

    if (consoleData.variants && Array.isArray(consoleData.variants) && consoleData.variants.length > 0) {
      const variants = consoleData.variants;
      defaultVar = variants.find((v: any) => v.is_default) || variants[0];
      if (!finalImage) finalImage = defaultVar?.image_url;
    }

    // Prepare Base URL dynamically based on environment (Vercel Preview vs Production)
    const getBaseUrl = () => {
      // Vercel deployment URLs (Preview environments)
      if (process.env.VERCEL_URL) {
        return process.env.VERCEL_URL.startsWith('http')
          ? process.env.VERCEL_URL
          : `https://${process.env.VERCEL_URL}`;
      }
      // Production fallback or local
      return process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://theretrocircuit.com';
    };

    const baseUrl = getBaseUrl();

    // Clean up image URL (ensure absolute if needed)
    const isRelative = finalImage && finalImage.startsWith('/');
    const imageUrl = isRelative
      ? `${baseUrl}${finalImage}`
      : (finalImage || `${baseUrl}/logo.png`);

    // Specs extraction
    const specs = [];
    if (defaultVar) {
      if (defaultVar.screen_size_inch) specs.push(`${defaultVar.screen_size_inch}" ${defaultVar.display_type || ''}`);
      if (defaultVar.screen_resolution_y) specs.push(`${defaultVar.screen_resolution_y}p`);
      if (defaultVar.cpu_model || defaultVar.cpu_architecture) specs.push(defaultVar.cpu_model || defaultVar.cpu_architecture);
      if (defaultVar.os) specs.push(defaultVar.os);
    }

    // 4. Load Font
    // We use fetch inside the function to get the arrayBuffer
    const fontData = await fetch(new URL(fontUrl)).then((res) => res.arrayBuffer()).catch(() => null);

    // 5. Render Image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: '#09090b', // zinc-950
            fontFamily: '"Press Start 2P", monospace',
          }}
        >
          {/* Left Side: Branding & CTA */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              height: '100%',
              padding: '48px',
              justifyContent: 'space-between',
              borderRight: '2px solid #27272a', // zinc-800
              background: '#09090b',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: 24, color: '#8b5cf6' }}>THE RETRO CIRCUIT</div>
              <div style={{ fontSize: 16, color: '#a1a1aa' }}>CLASSIFIED SPECS</div>
            </div>

            {/* Main Title / CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: 48, color: 'white', lineHeight: 1.1 }}>
                FULL SPECS<br />& REVIEW
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#09090b',
                  background: '#8b5cf6', // Violet-500
                  padding: '12px 24px',
                  marginTop: '24px',
                  width: 'fit-content',
                }}
              >
                VIEW DETAILS_
              </div>
            </div>
          </div>

          {/* Right Side: Console Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              height: '100%',
              background: '#18181b', // zinc-900
              padding: '48px',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Background Grid Accent (Simulated with simple overlay if needed, skipping for clean look) */}

            {/* Image Container */}
            <div
              style={{
                display: 'flex',
                width: '400px',
                height: '300px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={consoleData.name}
                width="400"
                height="300"
                style={{
                  objectFit: 'contain',
                  // Drop shadow for depth
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
                }}
              />
            </div>

            {/* Console Name */}
            <div
              style={{
                fontSize: 32,
                color: 'white',
                textAlign: 'center',
                marginBottom: '24px',
                maxWidth: '90%',
              }}
            >
              {consoleData.name.toUpperCase()}
            </div>

            {/* Specs List */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              {specs.slice(0, 4).map((spec, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 16,
                    color: '#e4e4e7', // zinc-200
                    background: '#27272a', // zinc-800
                    padding: '8px 16px',
                    border: '1px solid #3f3f46', // zinc-700
                  }}
                >
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [
            {
              name: 'Press Start 2P',
              data: fontData,
              style: 'normal',
            },
          ]
          : undefined,
      }
    );
  } catch (error) {
    console.error("OpenGraph Image Generation Error:", error);
    // Return a safe fallback UI inside a valid ImageResponse on catastrophic failure
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'white',
            background: '#09090b',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
          }}
        >
          THE RETRO CIRCUIT
        </div>
      ),
      { ...size }
    );
  }
}
