/**
 * Placeholder card backgrounds for Phase 1.
 *
 * `Trip.imageUrl` is empty until Phase 3 photography is wired up. Each
 * gradient stands in for a destination photo and is loosely matched to
 * that trip's landscape (stone greys for the Dolomites, river teal for
 * the Mekong, etc.) so cards still feel distinct and editorial.
 *
 * Replace with `next/image` once real imagery is available — remove this
 * file once no card depends on it.
 */

export const PLACEHOLDER_GRADIENTS = [
  'from-[#6b7a74] to-[#1f2421]', // The Quiet Dolomites — cool stone
  'from-[#3f6a73] to-[#10242b]', // Mekong River Drift — river teal
  'from-[#8a7560] to-[#2c2118]', // Patagonia Edge — windswept earth
  'from-[#7fa3b8] to-[#2a4350]', // Amalfi Slow Season — coastal blue
  'from-[#a3875f] to-[#33271a]', // Kyoto in Autumn — warm amber
  'from-[#5d7158] to-[#1c241c]', // Scottish Highlands Wild — heather green
  'from-[#c98a5e] to-[#3a2417]', // Lisbon Light — terracotta glow
  'from-[#cdb795] to-[#3d3325]', // Namib Desert Silence — desert sand
  'from-[#6f8f7a] to-[#1e2b22]', // Azores Green Hours — island green
  'from-[#d18b3f] to-[#3c2310]', // Rajasthan Gold — spice gold
] as const;

/** Returns a gradient for the given index, cycling if there are more cards than gradients. */
export function getPlaceholderGradient(index: number): string {
  return PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
}
