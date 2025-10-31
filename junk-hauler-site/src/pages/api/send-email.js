export const prerender = false;

/**
 * Email fallback notification.
 * This is only called if the Zapier webhook fails.
 * Sends email to team@junkhaulerboise.com with lead details.
 */

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Format lead information for email
    const emailSubject = `🚨 URGENT: New Lead - ${data.contactName} (Webhook Failed)`;

    const emailBody = `
URGENT: Zapier webhook failed - please follow up manually!

===========================================
CONTACT INFORMATION
===========================================
Name: ${data.contactName}
Phone: ${data.contactPhone}
Email: ${data.contactEmail}

===========================================
PROPERTY DETAILS
===========================================
Property Type: ${data.propertyType}
City: ${data.city}
${data.address ? `Address: ${data.address}` : ''}
Date Needed: ${data.dateNeeded}
${data.accessDifficult ? '⚠️ Difficult Access' : ''}

===========================================
JUNK DETAILS
===========================================
Types: ${data.junkTypes.join(', ')}

===========================================
AI ESTIMATE
===========================================
Volume: ${data.estimate?.cubicYards?.min}-${data.estimate?.cubicYards?.max} cubic yards
Price Range: $${data.estimate?.priceRange?.min} - $${data.estimate?.priceRange?.max}
Best Estimate: $${data.estimate?.priceRange?.estimate}
Confidence: ${data.estimate?.confidence}
${data.estimate?.notes ? `\nAI Notes: ${data.estimate.notes}` : ''}

===========================================
PHOTOS (${data.photos.length})
===========================================
${data.photos.map((p, i) => `Photo ${i + 1}: ${p.url}`).join('\n')}

${data.notes ? `\n===========================================\nADDITIONAL NOTES\n===========================================\n${data.notes}` : ''}

===========================================
METADATA
===========================================
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Boise' })}
Source: Website Quote Form

⚠️ ACTION REQUIRED: Zapier webhook failed, add this lead to Go High Level manually!
    `.trim();

    // Use a simple email API service
    // Option 1: Use Resend (if you set it up)
    // Option 2: Use a mailto: link generator
    // Option 3: Use Vercel's built-in email (if available)

    console.log('📧 Email fallback triggered:', {
      to: 'team@junkhaulerboise.com',
      subject: emailSubject,
      contact: data.contactName,
      phone: data.contactPhone,
      estimate: `$${data.estimate?.priceRange?.min}-${data.estimate?.priceRange?.max}`,
    });

    console.log('\n=== EMAIL BODY ===\n', emailBody, '\n==================\n');

    // TODO: Integrate with actual email service
    // For now, we're logging the email content
    // To implement:
    // 1. Sign up for Resend (https://resend.com)
    // 2. Add RESEND_API_KEY to environment variables
    // 3. Uncomment the code below:

    /*
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Junk Hauler Boise <leads@junkhaulerboise.com>',
          to: ['team@junkhaulerboise.com'],
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API failed: ${response.status}`);
      }

      console.log('✅ Email sent successfully via Resend');
    }
    */

    return new Response(
      JSON.stringify({ success: true, message: 'Email logged (fallback activated)' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error in email fallback:', error);
    return new Response(
      JSON.stringify({ error: 'Email fallback failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
