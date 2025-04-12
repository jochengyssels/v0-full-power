"use client"

/*
IMPORTANT: To fully optimize geospatial queries in Supabase:
1. Enable the PostGIS extension in your Supabase project:
   - Go to Database > Extensions
   - Search for "postgis" and enable it
   
2. Create a spatial index on your kitespots table:
   - Run this SQL in the SQL Editor:
   
   CREATE INDEX kitespots_geom_idx ON kitespots USING GIST (
     ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
   );
   
3. Update your queries to use PostGIS functions for better performance
*/

import { useState, useEffect, useRef, useMemo } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { AnimatePresence } from "motion/react"
import type { WorldMapProps, Kitespot, Cluster } from "./types"
import { debounce, getCoordinatesOnMap, isInViewport } from "./utils"
import MapMarker from "./map-marker"
import MapCluster from "./map-cluster"
import MapControls from "./map-controls"
import MapLegend from "./map-legend"

export default function WorldMap({ kitespots, onKitespotSelect, selectedSpots = [], className = "" }: WorldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: 0.5, y: 0.5 }) // Center of the map (0-1)
  const [hoveredSpot, setHoveredSpot] = useState<Kitespot | null>(null)
  const [showLegend, setShowLegend] = useState(false)
  const [isDataCached, setIsDataCached] = useState(false)
  const markersCache = useRef(new Map())
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch optimized kitespot data from edge function
  useEffect(() => {
    // Cancel previous request if a new one is made
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    async function fetchOptimizedKitespots() {
      if (kitespots.length > 0 && isDataCached) return

      setLoading(true)
      try {
        // Use Supabase Edge Function for optimized geospatial query
        const response = await fetch("/api/kitespots/geo-optimized", {
          signal: abortControllerRef.current?.signal,
          headers: {
            "Cache-Control": "max-age=3600", // Cache for 1 hour
          },
        })

        if (!response.ok) throw new Error("Failed to fetch optimized kitespot data")

        const data = await response.json()

        // Cache the results
        data.forEach((spot: Kitespot) => {
          markersCache.current.set(spot.id, spot)
        })

        setIsDataCached(true)
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching optimized kitespots:", error)
          setMapError("Failed to load kitespot data. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOptimizedKitespots()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [kitespots.length, isDataCached])

  // Simulate loading time (remove in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Cluster markers for better performance
  const getClusteredMarkers = () => {
    if (!mapContainer.current || kitespots.length === 0) return []

    const containerWidth = mapContainer.current.clientWidth || 800
    const containerHeight = mapContainer.current.clientHeight || 500

    // Simple grid-based clustering
    const cellSize = 50 // pixels
    const grid: Record<string, Kitespot[]> = {}

    // Group markers into cells
    kitespots.forEach((spot) => {
      if (!spot.latitude || !spot.longitude) return

      const { x, y } = getCoordinatesOnMap(spot.latitude, spot.longitude, containerWidth, containerHeight)

      // Skip if outside viewport
      if (!isInViewport(x, y, containerWidth, containerHeight)) {
        return
      }

      // Calculate grid cell
      const cellX = Math.floor(x / cellSize)
      const cellY = Math.floor(y / cellSize)
      const cellId = `${cellX}:${cellY}`

      if (!grid[cellId]) {
        grid[cellId] = []
      }

      grid[cellId].push(spot)
    })

    // Convert grid to markers
    const markers: (Kitespot | Cluster)[] = []

    Object.entries(grid).forEach(([cellId, spots]) => {
      if (spots.length === 1) {
        // Single marker
        markers.push(spots[0])
      } else {
        // Cluster
        const [cellX, cellY] = cellId.split(":").map(Number)
        const centerX = (cellX + 0.5) * cellSize
        const centerY = (cellY + 0.5) * cellSize

        markers.push({
          id: `cluster-${cellId}`,
          isCluster: true,
          count: spots.length,
          spots: spots,
          x: centerX,
          y: centerY,
        })
      }
    })

    return markers
  }

  // Handle zoom in with debounce
  const handleZoomIn = debounce(() => {
    setZoom(Math.min(zoom + 0.5, 4))
  }, 100)

  // Handle zoom out with debounce
  const handleZoomOut = debounce(() => {
    setZoom(Math.max(zoom - 0.5, 1))
  }, 100)

  // Reset view
  const handleResetView = () => {
    setZoom(1)
    setCenter({ x: 0.5, y: 0.5 })
  }

  // Handle cluster click
  const handleClusterClick = (cluster: Cluster) => {
    // Zoom in to the cluster
    setZoom(Math.min(zoom + 1, 4))

    // Center on the cluster
    if (mapContainer.current) {
      const containerWidth = mapContainer.current.clientWidth
      const containerHeight = mapContainer.current.clientHeight

      setCenter({
        x: cluster.x / containerWidth,
        y: cluster.y / containerHeight,
      })
    }

    // If there are only a few spots in the cluster, select the first one
    if (cluster.spots.length <= 3) {
      onKitespotSelect(cluster.spots[0])
    }
  }

  // Memoize markers for better performance
  const memoizedMarkers = useMemo(() => {
    // Use clustering for zoom levels < 2, individual markers for higher zoom
    return zoom < 2 ? getClusteredMarkers() : kitespots
  }, [kitespots, zoom, mapContainer.current?.clientWidth, mapContainer.current?.clientHeight])

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Background map image with gradient overlay */}
      <div className="absolute inset-0 bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/30 to-blue-100/30 mix-blend-overlay" />
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${(0.5 - center.x) * 100 * (zoom - 1)}%, ${(0.5 - center.y) * 100 * (zoom - 1)}%)`,
            transformOrigin: "center",
          }}
        >
          <Image src="/world-map-kitespots.png" alt="World Map with Kitespots" fill className="object-cover" priority />
        </div>
      </div>

      {/* Map container for markers */}
      <div
        ref={mapContainer}
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          willChange: "transform", // Add GPU acceleration hint
        }}
        data-supabase-collection="kitespots" // Add data attribute for tracking
      >
        {!loading &&
          memoizedMarkers.map((item) => {
            if ("isCluster" in item) {
              // Render cluster
              return <MapCluster key={item.id} cluster={item} onSelect={handleClusterClick} />
            } else {
              // Render individual marker
              if (!item.latitude || !item.longitude) return null

              // Get container dimensions
              const containerWidth = mapContainer.current?.clientWidth || 800
              const containerHeight = mapContainer.current?.clientHeight || 500

              // Convert lat/lng to x/y
              const { x, y } = getCoordinatesOnMap(item.latitude, item.longitude, containerWidth, containerHeight)

              // Implement viewport culling - only render markers that are visible
              if (!isInViewport(x, y, containerWidth, containerHeight)) return null

              const isSelected = selectedSpots.includes(item.id)
              const isHovered = hoveredSpot?.id === item.id

              return (
                <MapMarker
                  key={item.id}
                  spot={item}
                  x={x}
                  y={y}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  onSelect={onKitespotSelect}
                  onHover={setHoveredSpot}
                />
              )
            }
          })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
            <span className="text-gray-700">Loading map...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-md">
            <p className="text-red-500 mb-2">Map could not be loaded</p>
            <p className="text-gray-700 text-sm">{mapError}</p>
          </div>
        </div>
      )}

      {/* Map controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleResetView}
        onToggleLegend={() => setShowLegend(!showLegend)}
      />

      {/* Legend */}
      <AnimatePresence>{showLegend && <MapLegend />}</AnimatePresence>

      {/* Map attribution */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white/70 px-1 rounded">
        Interactive Kitespot Map
      </div>
    </div>
  )
}
