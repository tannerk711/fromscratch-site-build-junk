import Anthropic from '@anthropic-ai/sdk';
export { renderers } from '../../renderers.mjs';

// Pricing configuration
const PRICING_TIERS = {
  base_rate_per_yard: 25, // $25 per cubic yard
  minimum_charge: 150,     // $150 minimum
  disposal_fee_per_yard: 8, // $8 disposal fee per cubic yard

  labor_surcharges: {
    stairs: 50,
    difficult_access: 75,
    heavy_items: 100,
  },

  volume_discounts: [
    { min: 50, discount: 0.10 },  // 10% off for 50+ cubic yards
    { min: 100, discount: 0.15 }, // 15% off for 100+ cubic yards
    { min: 200, discount: 0.20 }, // 20% off for 200+ cubic yards
  ],
};

/**
 * Calculate price estimate based on cubic yards
 * @param {Object} params
 * @param {number} params.cubicYardsMin - Minimum cubic yards estimated
 * @param {number} params.cubicYardsMax - Maximum cubic yards estimated
 * @param {Object} params.options - Additional options (stairs, difficultAccess, etc.)
 * @returns {Object} Price range with min and max
 */
function calculatePrice({ cubicYardsMin, cubicYardsMax, options = {} }) {
  const minPrice = calculateSinglePrice(cubicYardsMin, options);
  const maxPrice = calculateSinglePrice(cubicYardsMax, options);

  return {
    min: Math.round(minPrice * 0.8), // -20% margin
    max: Math.round(maxPrice * 1.2), // +20% margin
    estimate: Math.round((minPrice + maxPrice) / 2), // Average
  };
}

function calculateSinglePrice(cubicYards, options) {
  // Base price calculation
  const basePrice = cubicYards * PRICING_TIERS.base_rate_per_yard;

  // Disposal fees
  const disposalFee = cubicYards * PRICING_TIERS.disposal_fee_per_yard;

  // Apply minimum charge
  let subtotal = Math.max(basePrice + disposalFee, PRICING_TIERS.minimum_charge);

  // Apply volume discounts
  let discount = 0;
  for (const tier of PRICING_TIERS.volume_discounts) {
    if (cubicYards >= tier.min) {
      discount = tier.discount;
    }
  }

  if (discount > 0) {
    subtotal = subtotal * (1 - discount);
  }

  // Add labor surcharges
  let surcharges = 0;
  if (options.stairs) {
    surcharges += PRICING_TIERS.labor_surcharges.stairs;
  }
  if (options.difficultAccess) {
    surcharges += PRICING_TIERS.labor_surcharges.difficult_access;
  }
  if (options.heavyItems) {
    surcharges += PRICING_TIERS.labor_surcharges.heavy_items;
  }

  return subtotal + surcharges;
}

const prerender = false;
async function POST({ request }) {
  try {
    const { photos, junkTypes, propertyType } = await request.json();
    if (!photos || photos.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photos provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const apiKey = undefined                                 ;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const anthropic = new Anthropic({ apiKey });
    const prompt = buildEstimationPrompt(junkTypes, propertyType, photos.length);
    const imageContent = photos.map((photo) => ({
      type: "image",
      source: {
        type: "url",
        url: photo.url
      }
    }));
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            ...imageContent
          ]
        }
      ]
    });
    const responseText = message.content[0].text;
    const estimate = parseClaudeResponse(responseText);
    const priceRange = calculatePrice({
      cubicYardsMin: estimate.cubic_yards_min,
      cubicYardsMax: estimate.cubic_yards_max,
      options: {}
      // Can add options based on form data later
    });
    const result = {
      cubicYards: {
        min: estimate.cubic_yards_min,
        max: estimate.cubic_yards_max
      },
      priceRange,
      confidence: estimate.confidence,
      items: estimate.items || [],
      notes: estimate.notes || ""
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Estimation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate estimate" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
function buildEstimationPrompt(junkTypes, propertyType, photoCount) {
  return `You are an expert junk removal volume estimator. Analyze the ${photoCount} image(s) provided and estimate the total cubic yards of junk/debris.

**Context:**
- Property Type: ${propertyType}
- Reported Junk Types: ${junkTypes.join(", ")}

**Reference Examples (for calibration):**
- A standard 3-seater sofa = ~10-15 cubic yards
- A king mattress + box spring = ~15-20 cubic yards
- A refrigerator = ~20-25 cubic yards
- A pickup truck bed full (loosely packed) = ~50-75 cubic yards
- A single room cleanout (10x10 room) = ~100-150 cubic yards
- A garage full of items = ~200-300 cubic yards

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
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        cubic_yards_min: parsed.cubic_yards_min || 10,
        cubic_yards_max: parsed.cubic_yards_max || 20,
        confidence: parsed.confidence || "medium",
        items: parsed.items || [],
        notes: parsed.notes || ""
      };
    }
    return {
      cubic_yards_min: 10,
      cubic_yards_max: 30,
      confidence: "low",
      items: [],
      notes: "Could not parse AI response. Using conservative estimate."
    };
  } catch (error) {
    console.error("Failed to parse Claude response:", error);
    return {
      cubic_yards_min: 10,
      cubic_yards_max: 30,
      confidence: "low",
      items: [],
      notes: "Error parsing estimate. Using conservative default."
    };
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
