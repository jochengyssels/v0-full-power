"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import * as maptilersdk from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"

// Set MapTiler API key
const MAPTILER_API_KEY = "tVjXN27gMACKRAmwmC1v"

interface KiteschoolsMapProps {
  schools: any[]
  onSchoolSelect: (schoolId: string) => void
  selectedSchools?: string[]
}

export default function KiteschoolsMap({ schools, onSchoolSelect, selectedSchools = [] }: KiteschoolsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Initialize MapTiler
    maptilersdk.config.apiKey = MAPTILER_API_KEY

    if (!mapContainer.current) return

    // Initialize map
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.DARK,
      center: [0, 30], // Center on the world
      zoom: 1.5,
    })

    // Wait for map to load
    map.current.on("load", () => {
      setLoading(false)
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Add markers when schools or map changes
  useEffect(() => {
    if (!map.current || loading || !schools.length) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add schools as markers
    schools.forEach((school) => {
      // Extract coordinates from location string or use default
      const coords = extractCoordinates(school.location, school.country)

      if (!coords) return

      // Create marker element
      const el = document.createElement("div")
      el.className = "kiteschool-marker"
      el.style.width = "30px"
      el.style.height = "30px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = school.color || "#3a7cc3"
      el.style.border = "2px solid white"
      el.style.cursor = "pointer"
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"

      // Highlight selected schools
      if (selectedSchools.includes(school.id)) {
        el.style.border = "3px solid yellow"
        el.style.zIndex = "10"
      }

      // Create popup
      const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 5px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${school.company_name}</h3>
          <p style="margin: 0; font-size: 12px;">${school.location}, ${school.country}</p>
          ${school.google_review_score ? `<p style="margin: 5px 0 0; font-size: 12px;">Rating: ${school.google_review_score} ⭐</p>` : ""}
        </div>
      `)

      // Create marker
      const marker = new maptilersdk.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map.current!)

      // Add click event
      el.addEventListener("click", () => {
        onSchoolSelect(school.id)
      })

      // Store marker reference for cleanup
      markersRef.current.push(marker)
    })
  }, [schools, selectedSchools, loading])

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
            <span className="text-gray-700 dark:text-gray-200">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to extract coordinates from location string
function extractCoordinates(location: string, country: string): { lat: number; lng: number } | null {
  // In a real app, you would use geocoding to get coordinates
  // For this demo, we'll use a simple mapping of known locations

  const locationMap: Record<string, { lat: number; lng: number }> = {
    "Punta Trettu, Sardinia": { lat: 39.1833, lng: 8.3167 },
    "Porto Botte, Sardinia": { lat: 39.03, lng: 8.4 },
    "Tarifa, Spain": { lat: 36.0143, lng: -5.6044 },
    "Dakhla, Morocco": { lat: 23.7136, lng: -15.9355 },
    "Cabarete, Dominican Republic": { lat: 19.758, lng: -70.4193 },
    "Cape Town, South Africa": { lat: -33.9249, lng: 18.4241 },
    "Jericoacoara, Brazil": { lat: -2.7975, lng: -40.5137 },
  }

  // Try to find an exact match
  for (const key in locationMap) {
    if (location.includes(key.split(",")[0])) {
      return locationMap[key]
    }
  }

  // If no match, generate random coordinates based on country
  // This is just for demo purposes
  const countryCoords: Record<string, { lat: number; lng: number }> = {
    Italy: { lat: 41.8719, lng: 12.5674 },
    Spain: { lat: 40.4168, lng: -3.7038 },
    Morocco: { lat: 31.7917, lng: -7.0926 },
    "Dominican Republic": { lat: 18.7357, lng: -70.1627 },
    "South Africa": { lat: -30.5595, lng: 22.9375 },
    Brazil: { lat: -15.7801, lng: -47.9292 },
  }

  if (countryCoords[country]) {
    const base = countryCoords[country]
    // Add some randomness to avoid overlapping markers
    return {
      lat: base.lat + (Math.random() - 0.5) * 2,
      lng: base.lng + (Math.random() - 0.5) * 2,
    }
  }

  // Default to a random location if country not found
  return {
    lat: Math.random() * 60 - 30,
    lng: Math.random() * 360 - 180,
  }
}
