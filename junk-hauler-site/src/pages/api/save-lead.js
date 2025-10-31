export const prerender = false;

/**
 * Save lead data.
 * Leads are managed through Go High Level CRM.
 * This endpoint logs the lead data for debugging and can be extended
 * to integrate with Go High Level API if needed.
 */

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Log lead data for debugging
    console.log('Lead data received:', {
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
      accessDifficult: data.accessDifficult || false,
      estimate: {
        cubicYards: `${data.estimate?.cubicYards?.min}-${data.estimate?.cubicYards?.max}`,
        price: `$${data.estimate?.priceRange?.min}-$${data.estimate?.priceRange?.max}`,
        confidence: data.estimate?.confidence,
      },
      photos: data.photos.length,
      notes: data.notes || 'None',
    });

    // Future: Integrate with Go High Level API here
    // Example:
    // const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${import.meta.env.GHL_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     name: data.contactName,
    //     email: data.contactEmail,
    //     phone: data.contactPhone,
    //     customFields: { ... }
    //   })
    // });

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
    console.error('Error processing lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
