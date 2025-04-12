import type { ReactNode } from "react"
import { motion } from "motion/react"
import KiteSizeCalculator from "./kite-size-calculator"
import GoldenTimeWindow from "./golden-time-window"
import KitesurfingProbability from "./kitesurfing-probability"
import KiteschoolDropdown from "./kiteschool-dropdown"

interface GoldenKiteWindowProps {
  children: ReactNode
  location: string
  windSpeed?: number
  latitude?: number
  longitude?: number
}

// Update the GoldenKiteWindow component to include the dropdown
export default function GoldenKiteWindow({
  children,
  location,
  windSpeed = 15,
  latitude,
  longitude,
}: GoldenKiteWindowProps) {
  // Add default coordinates if none are provided
  const defaultLat = latitude || 36.0143 // Tarifa, Spain as default
  const defaultLon = longitude || -5.6044

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/30 relative"
    >
      {/* Removed the kiteschool dropdown from here as it's now in the main layout */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Golden Kite Window</h2>
        <div className="flex justify-between items-center">
          <p className="text-white/70">Detailed forecast for {location}</p>
          <KiteschoolDropdown />
        </div>
      </div>

      <GoldenTimeWindow location={location} latitude={defaultLat} longitude={defaultLon} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <KiteSizeCalculator windSpeed={windSpeed} />

        <KitesurfingProbability
          location={location}
          latitude={defaultLat}
          longitude={defaultLon}
          windSpeed={windSpeed}
        />

        <div className="md:col-span-2 bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
          <h3 className="text-lg font-semibold text-white mb-2">Safety Information</h3>
          <p className="text-white/80 text-sm">
            Be aware of the strong currents that can develop during outgoing tides. Always kite with a buddy and inform
            yourself about local regulations.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
