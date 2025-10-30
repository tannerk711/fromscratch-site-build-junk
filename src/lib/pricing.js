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
export function calculatePrice({ cubicYardsMin, cubicYardsMax, options = {} }) {
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

/**
 * Get pricing breakdown for display
 * @param {number} cubicYards
 * @param {Object} options
 * @returns {Object} Detailed breakdown
 */
export function getPricingBreakdown(cubicYards, options = {}) {
  const basePrice = cubicYards * PRICING_TIERS.base_rate_per_yard;
  const disposalFee = cubicYards * PRICING_TIERS.disposal_fee_per_yard;

  let discount = 0;
  let discountAmount = 0;
  for (const tier of PRICING_TIERS.volume_discounts) {
    if (cubicYards >= tier.min) {
      discount = tier.discount;
    }
  }

  const subtotalBeforeDiscount = Math.max(basePrice + disposalFee, PRICING_TIERS.minimum_charge);

  if (discount > 0) {
    discountAmount = subtotalBeforeDiscount * discount;
  }

  const subtotal = subtotalBeforeDiscount - discountAmount;

  const surcharges = [];
  let surchargeTotal = 0;

  if (options.stairs) {
    surcharges.push({ name: 'Stairs', amount: PRICING_TIERS.labor_surcharges.stairs });
    surchargeTotal += PRICING_TIERS.labor_surcharges.stairs;
  }
  if (options.difficultAccess) {
    surcharges.push({ name: 'Difficult Access', amount: PRICING_TIERS.labor_surcharges.difficult_access });
    surchargeTotal += PRICING_TIERS.labor_surcharges.difficult_access;
  }
  if (options.heavyItems) {
    surcharges.push({ name: 'Heavy Items', amount: PRICING_TIERS.labor_surcharges.heavy_items });
    surchargeTotal += PRICING_TIERS.labor_surcharges.heavy_items;
  }

  const total = subtotal + surchargeTotal;

  return {
    basePrice,
    disposalFee,
    discount: discountAmount,
    discountPercent: discount * 100,
    subtotal,
    surcharges,
    surchargeTotal,
    total: Math.round(total),
  };
}
