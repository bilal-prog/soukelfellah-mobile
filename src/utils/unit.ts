export interface UnitLike {
  name?: string
  darijaName?: string
}

/**
 * Checks whether a unit is "حبة" (piece).
 */
export const isPieceUnit = (unit?: UnitLike | string | null): boolean => {
  if (!unit) return false
  if (typeof unit === "string") return unit.trim() === "حبة"
  const name = unit.name?.trim()
  const darijaName = unit.darijaName?.trim()
  return name === "حبة" || darijaName === "حبة"
}

/**
 * Returns the display name for a unit, or undefined if the unit should be hidden (e.g. "حبة").
 */
export const getUnitDisplayName = (unit?: UnitLike | string | null): string | undefined => {
  if (!unit || isPieceUnit(unit)) return undefined
  if (typeof unit === "string") return unit.trim() || undefined
  return unit.darijaName || unit.name || undefined
}
