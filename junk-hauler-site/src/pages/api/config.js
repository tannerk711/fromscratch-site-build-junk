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

export async function GET({ request }) {
  try {
    // Collect all environment variable info for debugging
    const envDebug = {
      'CLOUDINARY_CLOUD_NAME': import.meta.env.CLOUDINARY_CLOUD_NAME,
      'CLOUDINARY_UPLOAD_PRESET': import.meta.env.CLOUDINARY_UPLOAD_PRESET,
      'PUBLIC_CLOUDINARY_CLOUD_NAME': import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
      'PUBLIC_CLOUDINARY_UPLOAD_PRESET': import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      'All CLOUDINARY keys': Object.keys(import.meta.env).filter(k => k.includes('CLOUDINARY'))
    };

    console.log('🔍 ENV VAR DEBUG:', envDebug);

    // Try non-PUBLIC_ first, fallback to PUBLIC_ if undefined
    const cloudinaryConfig = {
      cloudName: import.meta.env.CLOUDINARY_CLOUD_NAME || import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.CLOUDINARY_UPLOAD_PRESET || import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    };

    // Collect debug info about the values being used
    const configDebug = {
      cloudName: cloudinaryConfig.cloudName,
      cloudNameType: typeof cloudinaryConfig.cloudName,
      cloudNameLength: cloudinaryConfig.cloudName?.length,
      uploadPreset: cloudinaryConfig.uploadPreset,
      uploadPresetType: typeof cloudinaryConfig.uploadPreset,
      uploadPresetLength: cloudinaryConfig.uploadPreset?.length,
      usedPublicPrefix: !import.meta.env.CLOUDINARY_CLOUD_NAME && !!import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
    };

    console.log('🔍 CONFIG VALUES:', configDebug);

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

    // Check if debug mode is requested
    const url = new URL(request.url);
    const isDebugMode = url.searchParams.get('debug') === 'true';

    // Build response with optional debug info
    const responseData = {
      cloudName: cloudinaryConfig.cloudName,
      uploadPreset: cloudinaryConfig.uploadPreset,
      ...(isDebugMode && {
        _debug: {
          envVars: envDebug,
          configValues: configDebug,
          note: 'Debug info included because ?debug=true was used'
        }
      })
    };

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': isDebugMode ? 'no-cache' : 'public, max-age=3600',
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
