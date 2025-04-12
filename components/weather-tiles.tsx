"use client"

import { useEffect, useState } from "react"
import { Wind, Loader2, AlertCircle, Sun, MapPin } from "lucide-react"
import { motion } from "motion/react"
import { fetchPopularKiteSpots } from "@/lib/api-service-interactions"
import { fetchKiteSpotWeather } from "@/lib/api-service"
import { recordSpotInteraction } from "@/lib/api-service-interactions"

interface WeatherData {
  windSpeed: number
  windDirection: number
  windGust: number
  temperature: number
  humidity: number
  precipitation: number
  cloudCover: number
  visibility: number
  timestamp: string
  spotId: string
  spotName: string
  isMockData: boolean
  weatherCode?: number
  isDay?: boolean
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

export default function WeatherTiles({ onLocationSelect }: WeatherTilesProps) {
  const [popularSpots, setPopularSpots] = useState<any[]>([])
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

  // Fetch popular kite spots and their weather data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const logs: string[] = []

      try {
        // Fetch popular kite spots
        logs.push("Fetching popular kite spots...")
        const spots = await fetchPopularKiteSpots(5) // Get top 5 popular spots
        setPopularSpots(spots)
        logs.push(`Received ${spots.length} popular kite spots`)

        // Fetch weather data for each popular spot
        const newWeatherData: Record<string, WeatherData | null> = {}

        for (const spot of spots) {
          try {
            logs.push(`Fetching weather data for ${spot.name}...`)
            const weather = await fetchKiteSpotWeather(spot.lat, spot.lng)
            newWeatherData[spot.name] = weather
            logs.push(`Successfully fetched weather data for ${spot.name}`)
          } catch (err) {
            logs.push(`Error fetching weather data for ${spot.name}: ${String(err)}`)
            console.error(`Error fetching weather data for ${spot.name}:`, err)

            // Use mock data as fallback
            newWeatherData[spot.name] = {
              windSpeed: 10 + Math.random() * 15,
              windDirection: Math.floor(Math.random() * 360),
              windGust: 15 + Math.random() * 10,
              temperature: 20 + Math.random() * 10,
              humidity: 60 + Math.random() * 20,
              precipitation: Math.random() * 2,
              cloudCover: Math.random() * 100,
              visibility: 10 + Math.random() * 10,
              timestamp: new Date().toISOString(),
              spotId: spot.id,
              spotName: spot.name,
              isMockData: true,
              weatherCode: 800,
              isDay: true,
            }
          }
        }

        setWeatherData(newWeatherData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        logs.push(`General error: ${errorMessage}`)
        console.error("Error fetching data:", err)
        setError("Failed to fetch data. Using mock data.")

        // Use fallback data for all spots
        setPopularSpots([
          {
            id: "1",
            name: "Punta Trettu",
            country: "Italy",
            region: "Sardinia",
            lat: 39.1833,
            lng: 8.3167,
            color: "#2a6cb3",
          },
          {
            id: "2",
            name: "Tarifa",
            country: "Spain",
            region: "Andalusia",
            lat: 36.0143,
            lng: -5.6044,
            color: "#4a94d3",
          },
          {
            id: "3",
            name: "Dakhla",
            country: "Morocco",
            region: "Western Sahara",
            lat: 23.7136,
            lng: -15.9355,
            color: "#3a7cc3",
          },
          {
            id: "4",
            name: "Cape Town",
            country: "South Africa",
            region: "Western Cape",
            lat: -33.9249,
            lng: 18.4241,
            color: "#7adcff",
          },
        ])

        // Generate mock weather data for fallback spots
        const mockWeatherData: Record<string, WeatherData | null> = {}
        for (const spot of ["Punta Trettu", "Tarifa", "Dakhla", "Cape Town"]) {
          mockWeatherData[spot] = {
            windSpeed: 10 + Math.random() * 15,
            windDirection: Math.floor(Math.random() * 360),
            windGust: 15 + Math.random() * 10,
            temperature: 20 + Math.random() * 10,
            humidity: 60 + Math.random() * 20,
            precipitation: Math.random() * 2,
            cloudCover: Math.random() * 100,
            visibility: 10 + Math.random() * 10,
            timestamp: new Date().toISOString(),
            spotId: "mock-id",
            spotName: spot,
            isMockData: true,
            weatherCode: 800,
            isDay: true,
          }
        }
        setWeatherData(mockWeatherData)
      } finally {
        setLoading(false)
        setApiLogs(logs)
      }
    }

    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle spot click and record interaction
  const handleSpotClick = (spot: any, location: string) => {
    // Record the click interaction
    try {
      recordSpotInteraction(spot.name, "click")
    } catch (err) {
      console.error("Failed to record click interaction:", err)
      // Continue with the click handling even if tracking fails
    }

    // Call the onLocationSelect callback if provided
    if (onLocationSelect) {
      onLocationSelect(location)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <Loader2 className="h-7 w-7 text-white animate-spin" />
        <span className="ml-2 text-white text-sm">Loading weather data...</span>
      </div>
    )
  }

  // Only show the number of tiles that fit the screen
  const visibleSpots = popularSpots.slice(0, visibleTiles)

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
          {error && (
            <div className="flex items-center text-amber-300 mr-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span className="text-xs">Demo data</span>
            </div>
          )}
          <p className="text-xs text-white/80">{dayName}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
        {visibleSpots.map((spot, index) => (
          <WeatherCard
            key={spot.id}
            spot={spot}
            data={weatherData[spot.name]}
            index={index}
            total={visibleSpots.length}
            onLocationSelect={(location) => handleSpotClick(spot, location)}
          />
        ))}
      </div>

      {/* API Logs (for debugging) - hidden in production */}
      {false && apiLogs.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto max-h-60">
          <h3 className="font-bold mb-2">API Logs:</h3>
          <pre>
            {apiLogs.map((log, i) => (
              <div key={i} className="mb-1">
                {log}
              </div>
            ))}
          </pre>
        </div>
      )}
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
  spot: any
  data: WeatherData | null
  index: number
  total: number
  onLocationSelect?: (location: string) => void
}) {
  // Calculate width based on number of tiles
  const width = `calc(${100 / total}% - ${((total - 1) * 12) / total}px)`

  // Get color based on wind conditions
  const getWindColor = (windSpeed: number) => {
    if (windSpeed < 10) return "text-red-500" // Too little wind
    if (windSpeed < 15) return "text-orange-400" // Marginal conditions
    if (windSpeed < 25) return "text-green-500" // Good conditions
    return "text-yellow-500" // Strong wind
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
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 h-full p-3">
          {/* Location Header - Compact design */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">{spot.name}</h3>
              <div className="text-xs text-white/70">{spot.country}</div>
            </div>
            <div className="flex items-center bg-slate-700/50 px-1.5 py-0.5 rounded">
              <div
                style={{ transform: `rotate(${data.windDirection}deg)` }}
                className="inline-block mr-1 text-white/80"
              >
                ↑
              </div>
              <span className="text-xs text-white/80">{getWindDirection(data.windDirection)}</span>
            </div>
          </div>

          {/* Main weather data - Colored icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wind className={`h-5 w-5 mr-1 ${getWindColor(data.windSpeed)}`} />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{msToKnots(data.windSpeed)}</span>
                <span className="text-xs text-white/60">knots</span>
              </div>
            </div>

            <div className="flex items-center">
              <Sun className="h-5 w-5 mr-1 text-yellow-400" />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{data.temperature.toFixed(0)}°</span>
                <span className="text-xs text-white/60">temp</span>
              </div>
            </div>

            <div className="flex items-center">
              <Wind className="h-5 w-5 mr-1 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{msToKnots(data.windGust)}</span>
                <span className="text-xs text-white/60">gust</span>
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
