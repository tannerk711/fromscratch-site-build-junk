import Anthropic from '@anthropic-ai/sdk';
import { calculatePrice } from '../../lib/pricing';

export const prerender = false;

export async function POST({ request }) {
  try {
    const { photos, junkTypes, propertyType } = await request.json();

    if (!photos || photos.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No photos provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Anthropic client
    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Build the prompt for Claude
    const prompt = buildEstimationPrompt(junkTypes, propertyType, photos.length);

    // Prepare image content for Claude
    const imageContent = photos.map((photo) => ({
      type: 'image',
      source: {
        type: 'url',
        url: photo.url,
      },
    }));

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            ...imageContent,
          ],
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    const estimate = parseClaudeResponse(responseText);

    // Calculate pricing based on cubic yard estimate
    const priceRange = calculatePrice({
      cubicYardsMin: estimate.cubic_yards_min,
      cubicYardsMax: estimate.cubic_yards_max,
      options: {}, // Can add options based on form data later
    });

    const result = {
      cubicYards: {
        min: estimate.cubic_yards_min,
        max: estimate.cubic_yards_max,
      },
      priceRange,
      confidence: estimate.confidence,
      items: estimate.items || [],
      notes: estimate.notes || '',
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Estimation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate estimate' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function buildEstimationPrompt(junkTypes, propertyType, photoCount) {
  return `You are an expert junk removal volume estimator. Analyze the ${photoCount} image(s) provided and estimate the total cubic yards of junk/debris.

**Context:**
- Property Type: ${propertyType}
- Reported Junk Types: ${junkTypes.join(', ')}

**Reference Examples (for calibration):**
- A standard 3-seater sofa = ~2-3 cubic yards
- A king mattress + box spring = ~3-4 cubic yards
- A refrigerator = ~4-5 cubic yards
- A standard pickup truck bed (8ft, loosely packed) = ~2-3 cubic yards
- A single room cleanout (10x10 room, half full) = ~10-15 cubic yards
- A full one-car garage = ~30-50 cubic yards
- A full dump truck load = ~10-14 cubic yards

**Instructions:**
1. Carefully examine all images provided
2. Identify visible items and estimate their individual volumes
3. Account for items that may be hidden or stacked
4. Consider packing density (items are typically loosely arranged)
5. Provide conservative estimates (it's better to underestimate slightly)

**Return ONLY a valid JSON object in this exact format:**
{
  "cubic_yards_min": <number>,
  "cubic_yards_max": <number>,
  "confidence": "<high|medium|low>",
  "items": [
    {"type": "<item description>", "quantity": <number>, "cubic_yards": <number>}
  ],
  "notes": "<any important observations or caveats>"
}

**Important:**
- Be conservative with estimates
- If items are partially visible or stacked, account for hidden volume
- Consider the surrounding space for scale
- Note if multiple angles show the same items to avoid double-counting
- If confidence is low, explain why in notes`;
}

function parseClaudeResponse(responseText) {
  try {
    // Try to find JSON in the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        cubic_yards_min: parsed.cubic_yards_min || 10,
        cubic_yards_max: parsed.cubic_yards_max || 20,
        confidence: parsed.confidence || 'medium',
        items: parsed.items || [],
        notes: parsed.notes || '',
      };
    }

    // Fallback if JSON parsing fails
    return {
      cubic_yards_min: 10,
      cubic_yards_max: 30,
      confidence: 'low',
      items: [],
      notes: 'Could not parse AI response. Using conservative estimate.',
    };
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    return {
      cubic_yards_min: 10,
      cubic_yards_max: 30,
      confidence: 'low',
      items: [],
      notes: 'Error parsing estimate. Using conservative default.',
    };
  }
}
