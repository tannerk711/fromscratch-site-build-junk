export const prerender = false;

/**
 * Save lead data and send to Go High Level via Zapier webhook.
 * Includes retry logic and email fallback for reliability.
 */

export async function POST({ request }) {
  try {
    const data = await request.json();

    // SPAM PROTECTION: Check honeypot field
    if (data.website && data.website.length > 0) {
      console.warn('⚠️  Spam submission detected (honeypot triggered):', {
        contactEmail: data.contactEmail,
        honeypotValue: data.website,
      });
      // Return success to not tip off spammers
      return new Response(
        JSON.stringify({ success: true, message: 'Lead received' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log lead data for debugging
    console.log('✅ Valid lead received:', {
      timestamp: new Date().toISOString(),
      contact: {
        name: data.contactName,
        email: data.contactEmail,
        phone: data.contactPhone,
      },
      location: {
        city: data.city,
        address: data.address || 'Not provided',
      },
      propertyType: data.propertyType,
      junkTypes: data.junkTypes,
      dateNeeded: data.dateNeeded,
      estimate: {
        cubicYards: `${data.estimate?.cubicYards?.min}-${data.estimate?.cubicYards?.max}`,
        price: `$${data.estimate?.priceRange?.min}-$${data.estimate?.priceRange?.max}`,
        confidence: data.estimate?.confidence,
      },
      photos: data.photos.length,
    });

    // SEND TO ZAPIER WEBHOOK (which forwards to Go High Level)
    const zapierWebhookUrl = import.meta.env.ZAPIER_WEBHOOK_URL;

    if (zapierWebhookUrl) {
      try {
        const webhookPayload = {
          // Contact Information
          name: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone,

          // Property Details
          propertyType: data.propertyType,
          junkTypes: data.junkTypes.join(', '),
          city: data.city,
          address: data.address || '',
          dateNeeded: data.dateNeeded,
          accessDifficult: data.accessDifficult || false,
          notes: data.notes || '',

          // AI Estimate
          cubicYardsMin: data.estimate?.cubicYards?.min,
          cubicYardsMax: data.estimate?.cubicYards?.max,
          priceMin: data.estimate?.priceRange?.min,
          priceMax: data.estimate?.priceRange?.max,
          priceEstimate: data.estimate?.priceRange?.estimate,
          confidence: data.estimate?.confidence,
          aiNotes: data.estimate?.notes || '',

          // Photos
          photoCount: data.photos.length,
          photoUrls: data.photos.map(p => p.url).join('\n'),

          // Metadata
          submittedAt: new Date().toISOString(),
          source: 'Website Quote Form',
        };

        const response = await sendWithRetry(zapierWebhookUrl, webhookPayload, 3);

        if (!response.ok) {
          throw new Error(`Webhook failed with status ${response.status}`);
        }

        console.log('✅ Lead sent to Zapier/GHL successfully');

      } catch (webhookError) {
        console.error('❌ Zapier webhook failed:', webhookError);

        // FALLBACK: Send email notification
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          console.log('📧 Fallback email sent successfully');
        } catch (emailError) {
          console.error('❌ Email fallback also failed:', emailError);
        }
      }
    } else {
      console.warn('⚠️  ZAPIER_WEBHOOK_URL not configured - lead not sent to CRM');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead received successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error processing lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Send webhook with retry logic (exponential backoff)
 */
async function sendWithRetry(url, payload, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📤 Sending to webhook (attempt ${attempt}/${maxRetries})`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return response;
      }

      // If not last attempt and got server error, retry
      if (attempt < maxRetries && response.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Network error, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
