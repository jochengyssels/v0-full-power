"use client"

// Cluster component for the WorldMap
import { motion } from "motion/react"
import type { Cluster } from "./types"

interface MapClusterProps {
  cluster: Cluster
  onSelect: (cluster: Cluster) => void
}

export default function MapCluster({ cluster, onSelect }: MapClusterProps) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        left: `${cluster.x}px`,
        top: `${cluster.y}px`,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="bg-blue-500 rounded-full cursor-pointer shadow-lg border-2 border-white flex items-center justify-center"
        style={{
          width: `${Math.min(24 + cluster.count * 3, 40)}px`,
          height: `${Math.min(24 + cluster.count * 3, 40)}px`,
        }}
        onClick={() => onSelect(cluster)}
      >
        <span className="text-white font-medium text-xs">{cluster.count}</span>
      </motion.div>
    </div>
  )
}
