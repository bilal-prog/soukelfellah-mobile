/**
 * Helper to construct a full address string for agricultural listings.
 * Combines specific address, commune, province/city, and region, and removes duplicates.
 *
 * Example: "سيدي بنور، الدكالة" + Region "Casablanca-Settat" + Province "Sidi Bennour"
 */
export const formatFullAddress = (location: any): string => {
  if (!location) return ""

  const parts: string[] = []
  if (location.address) parts.push(location.address.trim())
  if (location.commune) parts.push(location.commune.trim())
  if (location.province) parts.push(location.province.trim())
  if (location.region) parts.push(location.region.trim())

  // De-duplicate segments to avoid repetitive layouts (e.g. "Sidi Bennour, Sidi Bennour")
  const uniqueParts: string[] = []
  parts.forEach((part) => {
    if (part && !uniqueParts.includes(part)) {
      uniqueParts.push(part)
    }
  })

  return uniqueParts.join(", ")
}
