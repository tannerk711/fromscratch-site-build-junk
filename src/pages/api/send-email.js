export const prerender = false;

/**
 * Send email notification for new lead
 *
 * To set up Resend:
 * 1. Go to https://resend.com and create an account
 * 2. Verify your domain (or use onboarding@resend.dev for testing)
 * 3. Create an API key
 * 4. Add to .env: RESEND_API_KEY=your_api_key
 * 5. Install: npm install resend
 */

export async function POST({ request }) {
  try {
    const data = await request.json();

    // For now, just log the email (you'll replace this with actual Resend)
    console.log('Email notification for lead:', {
      to: 'team@junkhaulerboise.com',
      from: data.contactEmail,
      name: data.contactName,
      phone: data.contactPhone,
      estimate: `$${data.estimate?.priceRange?.min} - $${data.estimate?.priceRange?.max}`,
    });

    // TODO: Implement Resend email
    // Example implementation:
    /*
    import { Resend } from 'resend';

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; }
            .estimate { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .estimate-price { font-size: 32px; font-weight: bold; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 New Junk Removal Lead</h1>
            </div>
            <div class="content">
              <div class="estimate">
                <div>Estimated Price Range</div>
                <div class="estimate-price">
                  $${data.estimate?.priceRange?.min} - $${data.estimate?.priceRange?.max}
                </div>
                <div style="margin-top: 10px; opacity: 0.9;">
                  ${data.estimate?.cubicYards?.min}-${data.estimate?.cubicYards?.max} cubic yards
                </div>
              </div>

              <div class="details">
                <div class="label">Contact Information</div>
                <div class="value">
                  <strong>${data.contactName}</strong><br>
                  📞 ${data.contactPhone}<br>
                  📧 ${data.contactEmail}
                </div>
              </div>

              <div class="details">
                <div class="label">Location</div>
                <div class="value">
                  ${data.city}${data.address ? `, ${data.address}` : ''}
                </div>
              </div>

              <div class="details">
                <div class="label">Property Type</div>
                <div class="value">${data.propertyType}</div>
              </div>

              <div class="details">
                <div class="label">Junk Types</div>
                <div class="value">${data.junkTypes.join(', ')}</div>
              </div>

              <div class="details">
                <div class="label">Date Needed</div>
                <div class="value">${data.dateNeeded}</div>
              </div>

              ${data.notes ? `
                <div class="details">
                  <div class="label">Additional Notes</div>
                  <div class="value">${data.notes}</div>
                </div>
              ` : ''}

              ${data.estimate?.items && data.estimate.items.length > 0 ? `
                <div class="details">
                  <div class="label">AI Detected Items</div>
                  <div class="value">
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      ${data.estimate.items.map(item => `
                        <li>${item.type}${item.quantity > 1 ? ` (${item.quantity}x)` : ''}</li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              ` : ''}

              <div class="details">
                <div class="label">Photos (${data.photos.length})</div>
                <div class="value" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                  ${data.photos.map(photo => `
                    <img src="${photo.url}" alt="Junk photo" style="width: 100%; border-radius: 4px;">
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This lead was generated through your website quote form</p>
              <p>Respond as soon as possible to increase conversion rate!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Junk Hauler Leads <leads@junkhaulerboise.com>',
      to: 'team@junkhaulerboise.com',
      subject: `New Lead: ${data.contactName} - ${data.city} - $${data.estimate?.priceRange?.min}-${data.estimate?.priceRange?.max}`,
      html: emailHtml,
    });
    */

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
