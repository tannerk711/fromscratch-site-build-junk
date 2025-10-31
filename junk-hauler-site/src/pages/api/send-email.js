export const prerender = false;

/**
 * Email notifications are handled by Go High Level CRM.
 * This endpoint logs the lead submission for debugging purposes.
 */

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Log lead submission for debugging
    console.log('Lead submitted successfully:', {
      contact: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      city: data.city,
      estimate: `$${data.estimate?.priceRange?.min} - $${data.estimate?.priceRange?.max}`,
      cubicYards: `${data.estimate?.cubicYards?.min}-${data.estimate?.cubicYards?.max} yards`,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Lead logged successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
