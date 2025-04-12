"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { MapPin, Wind, Waves, Compass, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import WindRose from "./wind-rose"
import DifficultyMeter from "./difficulty-meter"
import SeasonChart from "./season-chart"
import { cn } from "@/lib/utils"

interface KitespotCardProps {
  kitespot: any
  onClick?: () => void
  className?: string
}

export default function KitespotCard({ kitespot, onClick, className }: KitespotCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Generate mock data for visualization components
  const getWindRoseData = () => {
    // In a real app, this would come from the database
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    return directions.map((direction) => ({
      direction,
      percentage: Math.floor(Math.random() * 80) + 20,
    }))
  }

  const getBestMonths = () => {
    // In a real app, this would come from the database
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Randomly select 4-6 consecutive months
    const startIndex = Math.floor(Math.random() * 7) // 0-6
    const count = Math.floor(Math.random() * 3) + 4 // 4-6

    return allMonths.slice(startIndex, startIndex + count)
  }

  // Get image for the kitespot
  const getKitespotImage = () => {
    // In a real app, this would come from the database or a mapping
    const defaultImage = "/vibrant-kitesurfing-scene.png"

    // Try to match known locations with images
    const locationMap: Record<string, string> = {
      Tarifa: "/images/tarifa-kitesurfing.png",
      Dakhla: "/images/dakhla-kitesurfing.png",
      Jericoacoara: "/images/jericoacoara-kitesurfing.png",
      Cabarete: "/images/cabarete-kitesurfing.png",
      "Cape Town": "/images/cape-town-kitesurfing.png",
      "Punta Trettu": "/images/punta-trettu-kitesurfing.png",
    }

    // Check if we have an image for this location
    for (const [key, value] of Object.entries(locationMap)) {
      if (kitespot.name.includes(key)) {
        return value
      }
    }

    return defaultImage
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 shadow-lg",
        className,
      )}
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getKitespotImage() || "/placeholder.svg"}
          alt={kitespot.name}
          fill
          className="object-cover"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-xl font-bold text-white">{kitespot.name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>
              {kitespot.country}, {kitespot.location}
            </span>
          </div>
        </div>
      </div>

      {/* Basic info section */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Wind className="h-5 w-5 text-sky-400 mr-2" />
            <div>
              <div className="text-xs text-white/60">Difficulty</div>
              <div className="text-sm text-white font-medium capitalize">{kitespot.difficulty || "Intermediate"}</div>
            </div>
          </div>

          <div className="flex items-center">
            <Waves className="h-5 w-5 text-emerald-400 mr-2" />
            <div>
              <div className="text-xs text-white/60">Water Type</div>
              <div className="text-sm text-white font-medium capitalize">{kitespot.water_type || "Flat"}</div>
            </div>
          </div>
        </div>

        {/* Expand/collapse button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center py-2 text-white/70 hover:text-white text-sm transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4"
        >
          <div className="border-t border-slate-700/50 pt-4 space-y-4">
            {/* Wind rose and difficulty meter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-white/80 text-sm mb-2 flex items-center">
                  <Compass className="h-4 w-4 mr-1 text-sky-400" />
                  Wind Direction
                </h4>
                <div className="flex justify-center">
                  <WindRose directions={getWindRoseData()} />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-white/80 text-sm mb-2 flex items-center">
                  <Wind className="h-4 w-4 mr-1 text-amber-400" />
                  Difficulty Rating
                </h4>
                <div className="mt-8">
                  <DifficultyMeter difficulty={kitespot.difficulty || "Intermediate"} />
                </div>
              </div>
            </div>

            {/* Best season */}
            <div>
              <h4 className="text-white/80 text-sm mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-emerald-400" />
                Best Season
              </h4>
              <SeasonChart bestMonths={getBestMonths()} />
            </div>

            {/* Description */}
            <div>
              <h4 className="text-white/80 text-sm mb-2">About this spot</h4>
              <p className="text-white/70 text-sm">
                {kitespot.description ||
                  `${kitespot.name} is a popular kiteboarding destination located in ${kitespot.location}, ${kitespot.country}. 
                  It offers ${kitespot.water_type || "varied"} water conditions and is suitable for 
                  ${kitespot.difficulty || "intermediate"} riders.`}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Link
                href={`/kitespots?location=${encodeURIComponent(`${kitespot.name}, ${kitespot.country}`)}`}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Kitespot
              </Link>
              <button
                onClick={onClick}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Compare
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
