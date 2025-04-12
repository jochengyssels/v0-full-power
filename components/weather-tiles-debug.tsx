"use client"

import { useEffect, useState } from "react"
import { Wind, Loader2, AlertCircle, Sun, MapPin } from "lucide-react"
import { motion } from "motion/react"

// API key for StormGlass
const API_KEY = "baf9bbdc-09d0-11f0-b8ac-0242ac130003-baf9bc5e-09d0-11f0-b8ac-0242ac130003"

// Coordinates for popular kite spots
const kiteSpots = [
  {
    name: "Punta Trettu",
    country: "Italy",
    lat: 39.1833,
    lng: 8.3167,
    color: "#2a6cb3",
  },
  {
    name: "Dakhla",
    country: "Morocco",
    lat: 23.7136,
    lng: -15.9355,
    color: "#3a7cc3",
  },
  {
    name: "Tarifa",
    country: "Spain",
    lat: 36.0143,
    lng: -5.6044,
    color: "#4a94d3",
  },
  {
    name: "Jericoacoara",
    country: "Brazil",
    lat: -2.7975,
    lng: -40.5137,
    color: "#5aace3",
  },
  {
    name: "Cabarete",
    country: "Dominican Republic",
    lat: 19.758,
    lng: -70.4193,
    color: "#6ac4f3",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    lat: -33.9249,
    lng: 18.4241,
    color: "#7adcff",
  },
]

// Fallback image for all spots
const FALLBACK_IMAGE = "/images/kitespot-placeholder.png"

// Mock data for development/fallback
const mockWeatherData = {
  "Punta Trettu": {
    windSpeed: 14.5,
    windDirection: 315,
    gust: 19.8,
    airTemperature: 26.2,
    waveHeight: 0.8,
    time: new Date().toISOString(),
  },
  Dakhla: {
    windSpeed: 8.2,
    windDirection: 45,
    gust: 12.4,
    airTemperature: 24.5,
    waveHeight: 1.2,
    time: new Date().toISOString(),
  },
  Tarifa: {
    windSpeed: 10.5,
    windDirection: 90,
    gust: 15.7,
    airTemperature: 22.0,
    waveHeight: 1.8,
    time: new Date().toISOString(),
  },
  Jericoacoara: {
    windSpeed: 7.8,
    windDirection: 135,
    gust: 11.2,
    airTemperature: 29.3,
    waveHeight: 0.8,
    time: new Date().toISOString(),
  },
  Cabarete: {
    windSpeed: 6.5,
    windDirection: 70,
    gust: 9.8,
    airTemperature: 28.7,
    waveHeight: 1.5,
    time: new Date().toISOString(),
  },
  "Cape Town": {
    windSpeed: 12.3,
    windDirection: 180,
    gust: 18.5,
    airTemperature: 23.8,
    waveHeight: 2.1,
    time: new Date().toISOString(),
  },
}

// Type for weather data
interface WeatherData {
  windSpeed: number
  windDirection: number
  gust: number
  airTemperature: number
  waveHeight: number
  time: string
}

interface WeatherTilesProps {
  onLocationSelect?: (location: string) => void
}

// Get wind direction as text
const getWindDirection = (degrees: number) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Convert m/s to knots
const msToKnots = (ms: number) => (ms * 1.94384).toFixed(1)

// Convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius: number) => ((celsius * 9) / 5 + 32).toFixed(1)

// Update the WeatherTiles component to have a more compact header
export default function WeatherTiles({ onLocationSelect }: WeatherTilesProps) {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData | null>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleTiles, setVisibleTiles] = useState(5)
  const [apiLogs, setApiLogs] = useState<string[]>([])

  // Adjust visible tiles based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setVisibleTiles(2)
      } else if (width < 768) {
        setVisibleTiles(3)
      } else if (width < 1024) {
        setVisibleTiles(4)
      } else if (width < 1280) {
        setVisibleTiles(5)
      } else {
        setVisibleTiles(5)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // For debugging purposes, immediately use mock data
    setWeatherData(mockWeatherData)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <Loader2 className="h-7 w-7 text-white animate-spin" />
        <span className="ml-2 text-white text-sm">Loading weather data...</span>
      </div>
    )
  }

  // Only show the number of tiles that fit the screen
  const visibleSpots = kiteSpots.slice(0, visibleTiles)

  // Get current day name
  const today = new Date()
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()

  return (
    <div className="w-full mt-auto mb-2 self-end">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-white uppercase tracking-wider flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-primary" />
          Popular Kite Spots
        </h2>
        <div className="flex items-center">
          <div className="flex items-center text-amber-300 mr-2">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span className="text-xs">Demo data</span>
          </div>
          <p className="text-xs text-white/80">{dayName}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
        {visibleSpots.map((spot, index) => (
          <WeatherCard
            key={spot.name}
            spot={spot}
            data={weatherData[spot.name]}
            index={index}
            total={visibleSpots.length}
            onLocationSelect={onLocationSelect}
          />
        ))}
      </div>
    </div>
  )
}

function WeatherCard({
  spot,
  data,
  index,
  total,
  onLocationSelect,
}: {
  spot: (typeof kiteSpots)[0]
  data: WeatherData | null
  index: number
  total: number
  onLocationSelect?: (location: string) => void
}) {
  // Calculate width based on number of tiles
  const width = `calc(${100 / total}% - ${((total - 1) * 12) / total}px)`

  // Get color based on wind conditions
  const getWindColor = (windSpeed: number) => {
    if (windSpeed < 10) return "bg-red-500" // Too little wind
    if (windSpeed < 15) return "bg-orange-400" // Marginal conditions
    if (windSpeed < 25) return "bg-green-500" // Good conditions
    return "bg-yellow-500" // Strong wind
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-105"
      style={{ width }}
      onClick={() => onLocationSelect && onLocationSelect(`${spot.name}, ${spot.country}`)}
    >
      {data ? (
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 h-full">
          {/* Location Header - Simple colored background instead of image */}
          <div className="relative h-24 w-full overflow-hidden" style={{ backgroundColor: spot.color }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>

            {/* Location Name */}
            <div className="absolute bottom-0 left-0 w-full p-2">
              <h3 className="text-sm font-bold text-white uppercase">{spot.name}</h3>
              <div className="text-xs text-white/80">{spot.country}</div>
            </div>
          </div>

          {/* Wind and Temperature */}
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`${getWindColor(data.windSpeed)} w-6 h-6 rounded-full flex items-center justify-center`}
                >
                  <Wind className="h-3 w-3 text-white" />
                </div>
                <span className="text-white text-sm font-medium ml-1">{msToKnots(data.windSpeed)}</span>
              </div>
              <div className="flex items-center">
                <div className="bg-amber-500/20 w-6 h-6 rounded-full flex items-center justify-center">
                  <Sun className="h-3 w-3 text-yellow-400" />
                </div>
                <span className="text-white text-sm ml-1">{data.airTemperature.toFixed(0)}°</span>
              </div>
            </div>

            {/* Wind Direction and Gusts */}
            <div className="flex justify-between mt-2 text-xs text-white/70">
              <div className="flex items-center bg-slate-700/50 px-1.5 py-0.5 rounded">
                <div style={{ transform: `rotate(${data.windDirection}deg)` }} className="inline-block mr-1">
                  ↑
                </div>
                {getWindDirection(data.windDirection)}
              </div>
              <div className="flex items-center bg-slate-700/50 px-1.5 py-0.5 rounded">
                <span className="font-medium">{msToKnots(data.gust)}</span>
                <span className="ml-0.5">G</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[88px] bg-slate-800/90 p-2">
          <p className="text-white/80 text-xs">No data</p>
        </div>
      )}
    </motion.div>
  )
}
