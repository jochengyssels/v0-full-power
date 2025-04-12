// Utility functions for the WorldMap component
import type { MapCoordinates } from "./types"

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Convert latitude and longitude to x, y coordinates on the map using Mercator projection
 */
export function getCoordinatesOnMap(
  lat: number,
  lng: number,
  containerWidth: number,
  containerHeight: number,
): MapCoordinates {
  // Use Mercator projection for more accurate mapping
  const x = ((lng + 180) / 360) * containerWidth

  // Mercator formula for y coordinate
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = containerHeight / 2 - (containerWidth * mercN) / (2 * Math.PI)

  return { x, y }
}

/**
 * Get marker color based on difficulty
 */
export function getMarkerColor(difficulty: string | undefined): string {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return "bg-emerald-500"
    case "intermediate":
      return "bg-amber-500"
    case "advanced":
      return "bg-rose-500"
    default:
      return "bg-blue-500"
  }
}

/**
 * Get marker size based on selection and hover state
 */
export function getMarkerSize(isSelected: boolean, isHovered: boolean): string {
  if (isSelected) return "w-6 h-6"
  if (isHovered) return "w-5 h-5"
  return "w-4 h-4"
}

/**
 * Check if a point is within the viewport
 */
export function isInViewport(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number,
  padding = 50,
): boolean {
  return x >= -padding && x <= containerWidth + padding && y >= -padding && y <= containerHeight + padding
}
