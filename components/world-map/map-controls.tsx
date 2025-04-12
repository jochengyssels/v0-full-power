"use client"

// Controls component for the WorldMap
import { ZoomIn, ZoomOut, RefreshCw, Info } from "lucide-react"

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onToggleLegend: () => void
}

export default function MapControls({ onZoomIn, onZoomOut, onReset, onToggleLegend }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <button
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
        title="Zoom in"
        onClick={onZoomIn}
      >
        <ZoomIn className="h-5 w-5 text-gray-700" />
      </button>
      <button
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
        title="Zoom out"
        onClick={onZoomOut}
      >
        <ZoomOut className="h-5 w-5 text-gray-700" />
      </button>
      <button
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
        title="Reset view"
        onClick={onReset}
      >
        <RefreshCw className="h-5 w-5 text-gray-700" />
      </button>
      <button
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
        title="Show legend"
        onClick={onToggleLegend}
      >
        <Info className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  )
}
