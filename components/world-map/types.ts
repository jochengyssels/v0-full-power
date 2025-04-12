// Types for the WorldMap component
export interface Kitespot {
  id: string
  name: string
  country: string
  location?: string
  latitude: number
  longitude: number
  difficulty?: string
  water_type?: string
  rating?: number
  wind_reliability?: number
  wave_height?: number
  water_temp?: number
  best_season?: string[]
  image_url?: string
}

export interface Cluster {
  id: string
  isCluster: true
  count: number
  spots: Kitespot[]
  x: number
  y: number
}

export interface WorldMapProps {
  kitespots: Kitespot[]
  onKitespotSelect: (kitespot: Kitespot) => void
  selectedSpots?: string[]
  className?: string
}

export interface MapCoordinates {
  x: number
  y: number
}
