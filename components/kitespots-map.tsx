"use client"

import { useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import Image from "next/image"

interface KitespotsMapProps {
  kitespots?: any[]
  onKitespotSelect?: (kitespot: any) => void
  selectedSpots?: string[]
}

export default function KitespotsMap({
  kitespots = [],
  onKitespotSelect = () => {},
  selectedSpots = [],
}: KitespotsMapProps) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-slate-800">
      {/* Background map image */}
      <div className="absolute inset-0">
        <Image src="/world-map-kitespots.png" alt="World Map with Kitespots" fill className="object-cover opacity-50" />
      </div>

      {/* Overlay with markers */}
      <div className="absolute inset-0">
        {kitespots.map((spot, index) => {
          const leftPosition = ((spot.longitude + 180) / 360) * 100
          const topPosition = ((90 - spot.latitude) / 180) * 100
          const isSelected = selectedSpots.includes(spot.id)

          return (
            <div
              key={spot.id || index}
              className="absolute"
              style={{
                left: `${leftPosition}%`,
                top: `${topPosition}%`,
              }}
            >
              <div
                className={`w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  isSelected ? "bg-blue-500 ring-2 ring-white" : "bg-red-500"
                }`}
                onClick={() => onKitespotSelect(spot)}
              ></div>
            </div>
          )
        })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {kitespots.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <MapPin className="w-12 h-12 mb-2 text-slate-400" />
          <p className="text-slate-400">No kitespots to display</p>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-white/50">Interactive Kitespot Map</div>
    </div>
  )
}
