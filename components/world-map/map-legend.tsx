// Legend component for the WorldMap
import { motion } from "motion/react"

export default function MapLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200"
    >
      <h4 className="text-sm font-medium text-gray-800 mb-2">Difficulty Legend</h4>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
          <span className="text-xs text-gray-700">Beginner</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-xs text-gray-700">Intermediate</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-rose-500 mr-2"></div>
          <span className="text-xs text-gray-700">Advanced</span>
        </div>
      </div>
    </motion.div>
  )
}
