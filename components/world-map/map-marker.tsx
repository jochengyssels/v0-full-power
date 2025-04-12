"use client"

// Marker component for the WorldMap
import { motion, AnimatePresence } from "motion/react"
import { Wind, Waves } from "lucide-react"
import type { Kitespot } from "./types"
import { getMarkerColor, getMarkerSize } from "./utils"

interface MapMarkerProps {
  spot: Kitespot
  x: number
  y: number
  isSelected: boolean
  isHovered: boolean
  onSelect: (spot: Kitespot) => void
  onHover: (spot: Kitespot | null) => void
}

export default function MapMarker({ spot, x, y, isSelected, isHovered, onSelect, onHover }: MapMarkerProps) {
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        isSelected ? "z-20" : isHovered ? "z-15" : "z-10"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        willChange: "transform, opacity", // Add GPU acceleration hint
      }}
    >
      {/* Marker */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isSelected ? 1.2 : 1,
          opacity: 1,
        }}
        whileHover={{ scale: 1.2 }}
        className={`rounded-full cursor-pointer transition-all duration-300 shadow-lg ${getMarkerColor(
          spot.difficulty,
        )} ${getMarkerSize(isSelected, isHovered)} border-2 border-white`}
        onClick={() => onSelect(spot)}
        onMouseEnter={() => onHover(spot)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Pulse animation for selected spots */}
        {isSelected && <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-75"></span>}
      </motion.div>

      {/* Tooltip for hovered spots */}
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap z-30 min-w-[150px]"
          >
            <div className="font-medium text-gray-800 mb-1">{spot.name}</div>
            <div className="text-gray-600 text-xs mb-1">{spot.country}</div>
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <Wind className="h-3 w-3 mr-1 text-blue-500" />
              <span className="capitalize">{spot.difficulty || "Intermediate"}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Waves className="h-3 w-3 mr-1 text-blue-500" />
              <span className="capitalize">{spot.water_type || "Various"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
