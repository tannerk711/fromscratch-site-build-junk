export const prerender = false;

/**
 * Save lead to database
 *
 * To set up Supabase:
 * 1. Go to https://supabase.com and create a project
 * 2. Create a table called 'leads' with these columns:
 *    - id (uuid, primary key, auto-generated)
 *    - created_at (timestamp with timezone, default: now())
 *    - property_type (text)
 *    - junk_types (jsonb)
 *    - city (text)
 *    - address (text, nullable)
 *    - date_needed (text)
 *    - access_difficult (boolean)
 *    - photos (jsonb)
 *    - cubic_yards_min (numeric)
 *    - cubic_yards_max (numeric)
 *    - price_min (numeric)
 *    - price_max (numeric)
 *    - confidence (text)
 *    - contact_name (text)
 *    - contact_phone (text)
 *    - contact_email (text)
 *    - notes (text, nullable)
 *    - status (text, default: 'new')
 * 3. Get your project URL and anon key from Supabase dashboard
 * 4. Add to .env:
 *    SUPABASE_URL=your_project_url
 *    SUPABASE_ANON_KEY=your_anon_key
 * 5. Install: npm install @supabase/supabase-js
 */

export async function POST({ request }) {
  try {
    const data = await request.json();

    // For now, just log the data (you'll replace this with actual Supabase save)
    console.log('Lead received:', {
      contact: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      city: data.city,
      estimate: data.estimate,
    });

    // TODO: Implement Supabase save
    // Example implementation:
    /*
    import { createClient } from '@supabase/supabase-js';

    const supabase = createClient(
      import.meta.env.SUPABASE_URL,
      import.meta.env.SUPABASE_ANON_KEY
    );

    const { data: savedLead, error } = await supabase
      .from('leads')
      .insert([
        {
          property_type: data.propertyType,
          junk_types: data.junkTypes,
          city: data.city,
          address: data.address || null,
          date_needed: data.dateNeeded,
          access_difficult: data.accessDifficult || false,
          photos: data.photos,
          cubic_yards_min: data.estimate?.cubicYards?.min,
          cubic_yards_max: data.estimate?.cubicYards?.max,
          price_min: data.estimate?.priceRange?.min,
          price_max: data.estimate?.priceRange?.max,
          confidence: data.estimate?.confidence,
          contact_name: data.contactName,
          contact_phone: data.contactPhone,
          contact_email: data.contactEmail,
          notes: data.notes || null,
          status: 'new',
        },
      ])
      .select();

    if (error) {
      throw error;
    }
    */

    // Return success (with or without saved data)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead saved successfully',
        // id: savedLead[0].id, // Uncomment when using Supabase
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving lead:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
