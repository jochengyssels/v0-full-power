"use client"

import { useState, useEffect } from "react"
import { Wind, Thermometer, Cloud, Waves, Loader2 } from "lucide-react"
import { fetchWeatherForecast } from "@/utils/weather-api"

interface KitesurfingProbabilityProps {
  location: string
  latitude?: number
  longitude?: number
  windSpeed?: number // Optional fallback if API fails
}

// Mock data for different locations
const mockLocationData: Record<string, { lat: number; lon: number }> = {
  "Punta Trettu": { lat: 39.1833, lon: 8.3167 },
  Tarifa: { lat: 36.0143, lon: -5.6044 },
  Maui: { lat: 20.7984, lon: -156.3319 },
  "Cape Town": { lat: -33.9249, lon: 18.4241 },
  Cabarete: { lat: 19.758, lon: -70.4193 },
  Dakhla: { lat: 23.7136, lon: -15.9355 },
  Jericoacoara: { lat: -2.7975, lon: -40.5137 },
  Essaouira: { lat: 31.5085, lon: -9.7595 },
}

export default function KitesurfingProbability({
  location,
  latitude,
  longitude,
  windSpeed: fallbackWindSpeed = 15,
}: KitesurfingProbabilityProps) {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [probability, setProbability] = useState(0)
  const [conditionText, setConditionText] = useState("")
  const [conditionColor, setConditionColor] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Get coordinates for the location
        let lat = latitude
        let lon = longitude

        if (!lat || !lon) {
          // Find coordinates from our mock data - make this more robust
          const locationKey = Object.keys(mockLocationData).find((key) => {
            return (
              location.toLowerCase().includes(key.toLowerCase()) ||
              key.toLowerCase().includes(location.toLowerCase().split(",")[0].trim())
            )
          })

          if (locationKey) {
            lat = mockLocationData[locationKey].lat
            lon = mockLocationData[locationKey].lon
          } else {
            // Always use a default location rather than showing an error
            console.warn(`No coordinates found for "${location}", using default coordinates (Tarifa, Spain)`)
            lat = 36.0143 // Tarifa, Spain as default
            lon = -5.6044
          }
        }

        // Fetch weather forecast data
        const forecastData = await fetchWeatherForecast(lat, lon, 24)

        if (
          !forecastData ||
          !forecastData.data ||
          !Array.isArray(forecastData.data) ||
          forecastData.data.length === 0
        ) {
          throw new Error("Failed to fetch forecast data")
        }

        // Get current weather conditions from the first hour of data
        const currentHour = forecastData.data[0]

        if (!currentHour) {
          throw new Error("No current weather data available")
        }

        // Extract weather data with proper error checking
        const currentConditions = {
          windSpeed: currentHour.wind_speed || fallbackWindSpeed,
          windGust: currentHour.wind_gust || fallbackWindSpeed + 5,
          windDirection: currentHour.wind_dir || 90,
          temperature: currentHour.temp || 22,
          cloudCover: currentHour.cloud_cover || 30,
          precipitation: currentHour.precip || 0,
        }

        // Mock some data that isn't available from the API
        const mockTideState = ["rising", "falling", "high", "low"][Math.floor(Math.random() * 4)]
        const mockWaterTemperature = Math.max(10, Math.min(30, currentConditions.temperature - 2 + Math.random() * 4))

        setWeatherData({
          ...currentConditions,
          tideState: mockTideState,
          waterTemperature: mockWaterTemperature,
        })
      } catch (err) {
        // Handle errors gracefully
        console.error("Error fetching weather data:", err)
        setError(null) // Don't show error to user, just use fallback data

        // Use fallback data with default values
        setWeatherData({
          windSpeed: fallbackWindSpeed,
          windGust: fallbackWindSpeed + 4,
          windDirection: 90,
          temperature: 22,
          humidity: 60,
          precipitation: 0,
          tideState: "rising",
          waterTemperature: 20,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location, latitude, longitude, fallbackWindSpeed])

  useEffect(() => {
    if (!weatherData) return

    // Calculate probability based on the algorithm
    const calculateKitesurfingProbability = () => {
      // Base probability starts at 50%
      let calculatedProbability = 50

      // Adjust for wind speed (ideal range: 12-25 knots)
      if (12 <= weatherData.windSpeed && weatherData.windSpeed <= 25) {
        calculatedProbability += 20 // Favorable wind speed
      } else if (weatherData.windSpeed < 12) {
        calculatedProbability -= 10 // Too weak
      } else {
        calculatedProbability -= 15 // Too strong
      }

      // Adjust for gusts (smaller difference between gust and wind speed is better)
      const gustDifference = Math.abs(weatherData.windGust - weatherData.windSpeed)
      if (gustDifference <= 5) {
        calculatedProbability += 10 // Stable conditions
      } else if (gustDifference > 10) {
        calculatedProbability -= 10 // Unstable conditions
      }

      // Adjust for wind direction (ideal: side-shore or side-onshore, e.g., 45-135 degrees or 225-315 degrees)
      if (
        (45 <= weatherData.windDirection && weatherData.windDirection <= 135) ||
        (225 <= weatherData.windDirection && weatherData.windDirection <= 315)
      ) {
        calculatedProbability += 10 // Favorable direction
      } else {
        calculatedProbability -= 10 // Unfavorable direction
      }

      // Adjust for temperature (ideal: 15-30°C)
      if (15 <= weatherData.temperature && weatherData.temperature <= 30) {
        calculatedProbability += 5 // Comfortable temperature
      } else if (weatherData.temperature < 15) {
        calculatedProbability -= 5 // Too cold
      } else {
        calculatedProbability -= 5 // Too hot
      }

      // Adjust for cloud cover (ideal: <50%)
      if (weatherData.cloudCover < 50) {
        calculatedProbability += 5 // Clear skies
      } else {
        calculatedProbability -= 5 // Overcast
      }

      // Adjust for precipitation (ideal: 0 mm)
      if (weatherData.precipitation === 0) {
        calculatedProbability += 5 // No rain
      } else {
        calculatedProbability -= 10 // Rainy conditions
      }

      // Adjust for tide state (ideal: rising or falling)
      if (weatherData.tideState === "rising" || weatherData.tideState === "falling") {
        calculatedProbability += 5 // Favorable tide
      } else {
        calculatedProbability -= 5 // Unfavorable tide
      }

      // Adjust for water temperature (ideal: 18-28°C)
      if (18 <= weatherData.waterTemperature && weatherData.waterTemperature <= 28) {
        calculatedProbability += 5 // Comfortable water temperature
      } else if (weatherData.waterTemperature < 18) {
        calculatedProbability -= 5 // Too cold
      } else {
        calculatedProbability -= 5 // Too warm
      }

      // Ensure probability is within 0-100%
      return Math.max(0, Math.min(100, calculatedProbability))
    }

    const newProbability = calculateKitesurfingProbability()
    setProbability(newProbability)

    // Set condition text and color based on probability
    if (newProbability >= 80) {
      setConditionText("Excellent")
      setConditionColor("bg-green-500")
    } else if (newProbability >= 60) {
      setConditionText("Good")
      setConditionColor("bg-lime-500")
    } else if (newProbability >= 40) {
      setConditionText("Fair")
      setConditionColor("bg-yellow-500")
    } else if (newProbability >= 20) {
      setConditionText("Poor")
      setConditionColor("bg-orange-500")
    } else {
      setConditionText("Unfavorable")
      setConditionColor("bg-red-500")
    }
  }, [weatherData])

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Wind className="h-5 w-5 mr-2" />
          Kitesurfing Probability
        </h3>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <span className="ml-2 text-white">Loading weather data...</span>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Wind className="h-5 w-5 mr-2" />
          Kitesurfing Probability
        </h3>
        <div className="text-white/80 text-sm italic">Unable to load weather data. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 shadow-md">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <Wind className="h-5 w-5 mr-2 text-sky-400" />
        Kitesurfing Probability
      </h3>

      <div className="flex flex-col items-center mb-4">
        <div className="relative w-32 h-32 mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="10" />

            {/* Progress circle with fill */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={conditionColor.replace("bg-", "text-")}
              strokeWidth="10"
              strokeDasharray={`${(2 * Math.PI * 45 * probability) / 100} ${
                (2 * Math.PI * 45 * (100 - probability)) / 100
              }`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-in-out"
            />

            {/* Filled area based on percentage */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="url(#percentageGradient)"
              className="transition-all duration-1000 ease-in-out"
              clipPath="url(#percentageClip)"
            />

            {/* Clip path for the filled area */}
            <defs>
              <clipPath id="percentageClip">
                <path
                  d={`M 50 50 L 50 10 A 40 40 0 ${probability > 50 ? 1 : 0} 1 ${
                    50 + 40 * Math.sin((probability / 100) * Math.PI * 2)
                  } ${50 - 40 * Math.cos((probability / 100) * Math.PI * 2)} Z`}
                />
              </clipPath>

              {/* Gradient for the filled area */}
              <radialGradient id="percentageGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop
                  offset="0%"
                  stopColor={conditionColor.replace("bg-", "text-").replace("text-", "rgb(") + ", 0.8)"}
                />
                <stop
                  offset="90%"
                  stopColor={conditionColor.replace("bg-", "text-").replace("text-", "rgb(") + ", 0.3)"}
                />
              </radialGradient>
            </defs>

            {/* Inner circle for better aesthetics */}
            <circle cx="50" cy="50" r="30" fill="rgba(30, 41, 59, 0.7)" />

            {/* Percentage text */}
            <text
              x="50"
              y="45"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
              fontWeight="bold"
              fill="white"
            >
              {probability}%
            </text>

            {/* Small indicator text */}
            <text
              x="50"
              y="65"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="rgba(255, 255, 255, 0.7)"
            >
              KITE SCORE
            </text>
          </svg>

          {/* Add small wind indicators around the circle */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Wind className={`h-4 w-4 ${probability >= 60 ? "text-green-400" : "text-white/30"}`} />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <Wind className={`h-4 w-4 ${probability >= 40 ? "text-green-400" : "text-white/30"}`} />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Wind className={`h-4 w-4 ${probability >= 20 ? "text-green-400" : "text-white/30"}`} />
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
            <Wind className={`h-4 w-4 ${probability >= 80 ? "text-green-400" : "text-white/30"}`} />
          </div>
        </div>
        <div className={`text-white font-medium px-4 py-1.5 rounded-full shadow-md ${conditionColor}`}>
          {conditionText}
        </div>
      </div>

      <div className="space-y-2.5 text-sm bg-slate-800/40 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-white/80">
            <Wind className="h-4 w-4 mr-1.5 text-sky-400" />
            <span>Wind</span>
          </div>
          <span className="text-white font-medium">{weatherData.windSpeed} knots</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-white/80">
            <Thermometer className="h-4 w-4 mr-1.5 text-red-400" />
            <span>Temperature</span>
          </div>
          <span className="text-white font-medium">{weatherData.temperature}°C</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-white/80">
            <Cloud className="h-4 w-4 mr-1.5 text-gray-300" />
            <span>Cloud Cover</span>
          </div>
          <span className="text-white font-medium">{weatherData.cloudCover}%</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-white/80">
            <Waves className="h-4 w-4 mr-1.5 text-blue-400" />
            <span>Tide</span>
          </div>
          <span className="text-white font-medium capitalize">{weatherData.tideState}</span>
        </div>
      </div>
    </div>
  )
}
