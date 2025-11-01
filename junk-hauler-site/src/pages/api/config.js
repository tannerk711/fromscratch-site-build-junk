export const prerender = false;

/**
 * Server-side configuration endpoint
 * Returns Cloudinary credentials from environment variables
 *
 * IMPORTANT: Uses non-PUBLIC_ prefixed env vars to avoid build-time inlining.
 * Astro/Vite inlines PUBLIC_ vars at build time, making them static literals.
 * Server-side API routes should use non-PUBLIC_ vars for runtime access.
 * By fetching credentials from the server, we ensure Vercel's dashboard
 * environment variables are used at runtime.
 */

export async function GET() {
  try {
    const cloudinaryConfig = {
      cloudName: import.meta.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.CLOUDINARY_UPLOAD_PRESET,
    };

    // Validate that config is present
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      console.error('❌ Cloudinary config missing:', {
        cloudName: cloudinaryConfig.cloudName ? 'present' : 'MISSING',
        uploadPreset: cloudinaryConfig.uploadPreset ? 'present' : 'MISSING',
      });

      return new Response(
        JSON.stringify({
          error: 'Cloudinary configuration not available',
          cloudName: !!cloudinaryConfig.cloudName,
          uploadPreset: !!cloudinaryConfig.uploadPreset,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Cloudinary config loaded:', {
      cloudName: cloudinaryConfig.cloudName,
      uploadPreset: cloudinaryConfig.uploadPreset.substring(0, 5) + '***',
    });

    return new Response(
      JSON.stringify(cloudinaryConfig),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error('❌ Error loading config:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load configuration' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
