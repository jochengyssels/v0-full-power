"use client"

import { useState, useEffect } from "react"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  Wind,
  Loader2,
  AlertCircle,
  MapPin,
  Compass,
} from "lucide-react"
import { motion } from "motion/react"

interface WeatherData {
  temperature: number
  weathercode: number
  windspeed: number
  winddirection: number
  time: string
  is_day: number
  isMockData?: boolean
}

interface UserLocation {
  latitude: number
  longitude: number
}

interface CustomWeatherWidgetProps {
  latitude?: number
  longitude?: number
  location?: string
}

export default function CustomWeatherWidget({
  latitude: propLatitude,
  longitude: propLongitude,
  location = "",
}: CustomWeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [kitesurfProbability, setKitesurfProbability] = useState(0)
  const [locationName, setLocationName] = useState(location || "Loading location...")
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [geoLocationError, setGeoLocationError] = useState<string | null>(null)
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false)
  const [isRequestingLocation, setIsRequestingLocation] = useState<boolean>(false)

  // Update the requestGeolocation function to handle permission denial more gracefully
  const requestGeolocation = () => {
    setIsRequestingLocation(true)
    console.log("Requesting geolocation permission...")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          console.log(`Geolocation success! User coordinates: ${latitude}, ${longitude}`)
          setUserLocation({ latitude, longitude })
          setIsLocationEnabled(true)
          setGeoLocationError(null)
          setIsRequestingLocation(false)
        },
        (error) => {
          console.log(`Geolocation error (${error.code}): ${error.message}`)
          // Handle permission denied (error.code === 1) or other errors gracefully
          // Use default location instead of showing an error
          const defaultLocation = {
            latitude: 36.0143, // Tarifa, Spain as fallback
            longitude: -5.6044,
          }
          console.log(
            `Using default location: Tarifa, Spain (${defaultLocation.latitude}, ${defaultLocation.longitude})`,
          )
          setUserLocation(defaultLocation)
          setIsLocationEnabled(true) // Still enable functionality with default location
          setGeoLocationError(null) // Don't show an error to the user
          setIsRequestingLocation(false)
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0,
        },
      )
    } else {
      console.log("Geolocation is not supported by this browser.")
      // Use Tarifa, Spain as fallback
      setUserLocation({
        latitude: 36.0143,
        longitude: -5.6044,
      })
      setIsLocationEnabled(true)
      setGeoLocationError(null)
      setIsRequestingLocation(false)
    }
  }

  // Update the initial geolocation check in useEffect
  useEffect(() => {
    // If coordinates are provided via props, use those
    if (propLatitude && propLongitude) {
      console.log(`Using provided coordinates: ${propLatitude}, ${propLongitude}`)
      setUserLocation({
        latitude: propLatitude,
        longitude: propLongitude,
      })
      setIsLocationEnabled(true)
      return
    }

    // Otherwise, use default coordinates without showing an error
    console.log("Using default coordinates")
    setUserLocation({
      latitude: 36.0143, // Tarifa, Spain as default
      longitude: -5.6044,
    })
    setIsLocationEnabled(true)
    setLoading(false)

    // Try to get the user's location, but don't show an error if it fails
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          console.log(`Geolocation success! User coordinates: ${latitude}, ${longitude}`)
          setUserLocation({ latitude, longitude })
          setIsLocationEnabled(true)
          setGeoLocationError(null)
        },
        (error) => {
          console.log(`Geolocation error (${error.code}): ${error.message}`)
          // Keep using default location, don't show an error
          setGeoLocationError(null)
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0,
        },
      )
    }
  }, [propLatitude, propLongitude])

  // Step 2: Fetch location name and weather data once we have coordinates
  useEffect(() => {
    // Only proceed if we have coordinates
    if (!userLocation) return

    setLoading(true)
    const fetchData = async () => {
      setError(null)

      try {
        // Get location name if not provided
        if (!location) {
          try {
            // Use LocationIQ API for reverse geocoding
            const LOCATIONIQ_API_KEY = "pk.7d195946b1d5836bbef50b02dc8a4a41"
            const geocodingUrl = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${userLocation.latitude}&lon=${userLocation.longitude}&format=json`

            console.log("Geocoding API Request:", geocodingUrl)

            const geoResponse = await fetch(geocodingUrl, { signal: AbortSignal.timeout(5000) })

            console.log("Geocoding API Response Status:", geoResponse.status)

            if (geoResponse.ok) {
              const geoData = await geoResponse.json()
              console.log("Geocoding API Response Data:", geoData)

              if (geoData && geoData.address) {
                // Extract only the main location name and county
                const address = geoData.address
                const city = address.city || address.town || address.village || address.hamlet || ""
                const county = address.county || address.state || ""

                // Format as "City, County" or just "City" if no county
                const formattedLocation = county ? `${city}, ${county}` : city
                setLocationName(formattedLocation || "Current Location")
              } else if (geoData && geoData.display_name) {
                // Fallback to display_name but try to simplify it
                const parts = geoData.display_name.split(", ")
                // Take first part (usually the specific location) and a geographic region (usually 3rd or 4th part)
                const simplifiedLocation = parts.length > 3 ? `${parts[0]}, ${parts[3]}` : geoData.display_name
                setLocationName(simplifiedLocation)
              } else {
                setLocationName("Current Location")
              }
            } else {
              console.warn("Geocoding API error:", geoResponse.status)
              setLocationName("Current Location")
            }
          } catch (geoError) {
            console.error("Error getting location name:", geoError)
            setLocationName("Current Location")
          }
        }

        // Fetch weather data from your API
        try {
          // Use the API route that proxies to your FastAPI backend
          const weatherUrl = `/api/kite-spots/weather?lat=${userLocation.latitude}&lng=${userLocation.longitude}`
          console.log("Weather API Request:", weatherUrl)
          console.log("Fetching weather data...")

          const response = await fetch(weatherUrl, { signal: AbortSignal.timeout(8000) })

          console.log("Weather API Response Status:", response.status)

          if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`)
          }

          const data = await response.json()
          console.log("Weather API Response Data:", data)

          // Transform the data to match the expected format
          setWeatherData({
            temperature: data.temperature,
            weathercode: data.weatherCode || 0,
            windspeed: data.windSpeed,
            winddirection: data.windDirection,
            time: data.timestamp || new Date().toISOString(),
            is_day: new Date().getHours() > 6 && new Date().getHours() < 20 ? 1 : 0,
          })

          // Calculate kitesurfing probability
          calculateKitesurfProbability(data.windSpeed, data.weatherCode || 0)
        } catch (weatherError) {
          console.error("Failed to fetch weather data:", weatherError)
          setError(weatherError instanceof Error ? weatherError.message : "Could not load weather data")

          // Provide mock data as fallback
          const mockData = {
            temperature: 22,
            weathercode: 0,
            windspeed: 20,
            winddirection: 90,
            time: new Date().toISOString(),
            is_day: new Date().getHours() > 6 && new Date().getHours() < 20 ? 1 : 0,
            isMockData: true,
          }

          console.log("🔴 USING MOCK WEATHER DATA IN CUSTOM WIDGET:", mockData)
          console.warn("⚠️ USING MOCK WEATHER DATA: Real API data could not be fetched")
          setWeatherData(mockData)
          calculateKitesurfProbability(mockData.windspeed, mockData.weathercode)
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Could not load weather data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userLocation, location])

  // Convert km/h to knots
  const kmhToKnots = (kmh: number) => {
    return Math.round(kmh * 0.539957)
  }

  // Calculate kitesurfing probability based on wind speed and weather conditions
  const calculateKitesurfProbability = (windspeed: number, weathercode: number) => {
    // Base probability starts at 50%
    let probability = 50

    // Adjust for wind speed (ideal range: 12-25 knots / ~22-46 km/h)
    if (windspeed < 10) {
      probability -= 30 // Too little wind
    } else if (windspeed < 22) {
      probability -= 10 // Below ideal but possible
    } else if (windspeed <= 46) {
      probability += 30 // Ideal wind range
    } else if (windspeed <= 55) {
      probability += 10 // Strong but manageable for experienced kiters
    } else {
      probability -= 20 // Too strong
    }

    // Adjust for weather conditions
    if (weathercode <= 3) {
      // Clear or partly cloudy
      probability += 20
    } else if (weathercode <= 48) {
      // Cloudy or foggy
      probability += 0
    } else if (weathercode <= 57) {
      // Light drizzle
      probability -= 10
    } else if (weathercode <= 67) {
      // Rain
      probability -= 20
    } else if (weathercode <= 77) {
      // Snow
      probability -= 30
    } else if (weathercode <= 82) {
      // Rain showers
      probability -= 15
    } else {
      // Thunderstorm
      probability -= 40
    }

    // Ensure probability is between 0 and 100
    probability = Math.max(0, Math.min(100, probability))

    setKitesurfProbability(Math.round(probability))
  }

  // Get weather icon based on weather code
  const getWeatherIcon = (code: number, isDay: number) => {
    // Weather codes from Open-Meteo API
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog and depositing rime fog
    // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
    // 56, 57: Freezing Drizzle: Light and dense intensity
    // 61, 63, 65: Rain: Slight, moderate and heavy intensity
    // 66, 67: Freezing Rain: Light and heavy intensity
    // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
    // 77: Snow grains
    // 80, 81, 82: Rain showers: Slight, moderate, and violent
    // 85, 86: Snow showers slight and heavy
    // 95: Thunderstorm: Slight or moderate
    // 96, 99: Thunderstorm with slight and heavy hail

    const size = 36

    if (code === 0) {
      return isDay ? <Sun size={size} className="text-yellow-400" /> : <Moon size={size} className="text-gray-200" />
    } else if (code <= 3) {
      return <Cloud size={size} className="text-white" />
    } else if (code <= 48) {
      return <Cloud size={size} className="text-gray-300" />
    } else if (code <= 57) {
      return <CloudRain size={size} className="text-blue-300" />
    } else if (code <= 67) {
      return <CloudRain size={size} className="text-blue-400" />
    } else if (code <= 77) {
      return <CloudSnow size={size} className="text-blue-200" />
    } else if (code <= 82) {
      return <CloudRain size={size} className="text-blue-500" />
    } else if (code <= 86) {
      return <CloudSnow size={size} className="text-blue-300" />
    } else {
      return <CloudLightning size={size} className="text-yellow-300" />
    }
  }

  // Get weather description based on weather code
  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky"
    if (code <= 3) return "Partly cloudy"
    if (code <= 48) return "Foggy"
    if (code <= 57) return "Drizzle"
    if (code <= 67) return "Rainy"
    if (code <= 77) return "Snowy"
    if (code <= 82) return "Rain showers"
    if (code <= 86) return "Snow showers"
    return "Thunderstorm"
  }

  // Get probability text based on percentage
  const getProbabilityText = (probability: number) => {
    if (probability >= 80) return "Excellent"
    if (probability >= 60) return "Good"
    if (probability >= 40) return "Fair"
    if (probability >= 20) return "Poor"
    return "Unfavorable"
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

  // Update the UI message when geolocation is not enabled to be more user-friendly
  if (!isLocationEnabled && !propLatitude && !propLongitude) {
    return (
      <div className="w-full bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-white mb-3">Using default weather location (Tarifa, Spain)</p>
          <button
            onClick={requestGeolocation}
            disabled={isRequestingLocation}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 text-sm rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center font-medium"
          >
            {isRequestingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            <span>Use My Location Instead</span>
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
        <span className="text-white">Loading weather data...</span>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="w-full flex justify-center items-center py-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        <AlertCircle className="h-6 w-6 text-amber-400 mr-2" />
        <span className="text-white">{error || "Could not load weather data"}</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full bg-gradient-to-r from-slate-800/70 to-slate-700/70 backdrop-blur-md rounded-xl p-4 shadow-lg border ${error ? "border-amber-500/30" : "border-white/10"}`}
    >
      {(error || weatherData.isMockData) && (
        <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
          Using estimated data
        </div>
      )}
      {/* Header with location and time */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-sky-400 mr-1.5 flex-shrink-0" />
          <h2 className="text-xl font-semibold text-white truncate">{locationName}</h2>
        </div>
        <div className="text-white/70 text-sm bg-slate-700/50 px-2.5 py-1 rounded-full">
          {new Date(weatherData.time).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          |{" "}
          {new Date(weatherData.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {/* Main weather data display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Weather icon and temperature */}
        <div className="bg-transparent rounded-lg p-3 flex items-center justify-between">
          {getWeatherIcon(weatherData.weathercode, weatherData.is_day)}
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{weatherData.temperature}°C</p>
            <p className="text-white/70 text-xs">{getWeatherDescription(weatherData.weathercode)}</p>
          </div>
        </div>

        {/* Wind speed */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Wind className="h-4 w-4 text-sky-400 mr-1.5" />
            <span className="text-white/80 text-sm">Wind</span>
          </div>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-white">{kmhToKnots(weatherData.windspeed)}</p>
            <p className="text-white/70 text-sm ml-1">knots</p>
          </div>
        </div>

        {/* Wind direction */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Compass className="h-4 w-4 text-amber-400 mr-1.5" />
            <span className="text-white/80 text-sm">Direction</span>
          </div>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-white mr-2">{getWindDirection(weatherData.winddirection)}</p>
            <div
              style={{ transform: `rotate(${weatherData.winddirection}deg)` }}
              className="bg-amber-400/20 w-8 h-8 rounded-full flex items-center justify-center text-amber-400"
            >
              ↑
            </div>
          </div>
        </div>

        {/* Kitesurfing probability */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center mb-1">
            <AlertCircle className="h-4 w-4 text-white/70 mr-1.5" />
            <span className="text-white/80 text-sm">Kite Probability</span>
          </div>
          <div className="flex items-center">
            <div
              className="text-2xl font-bold mr-2"
              style={{
                color:
                  kitesurfProbability >= 80
                    ? "#22c55e"
                    : kitesurfProbability >= 60
                      ? "#84cc16"
                      : kitesurfProbability >= 40
                        ? "#eab308"
                        : kitesurfProbability >= 20
                          ? "#f97316"
                          : "#ef4444",
              }}
            >
              {kitesurfProbability}%
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor:
                  kitesurfProbability >= 80
                    ? "rgba(34, 197, 94, 0.2)"
                    : kitesurfProbability >= 60
                      ? "rgba(132, 204, 22, 0.2)"
                      : kitesurfProbability >= 40
                        ? "rgba(234, 179, 8, 0.2)"
                        : kitesurfProbability >= 20
                          ? "rgba(249, 115, 22, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                color:
                  kitesurfProbability >= 80
                    ? "#22c55e"
                    : kitesurfProbability >= 60
                      ? "#84cc16"
                      : kitesurfProbability >= 40
                        ? "#eab308"
                        : kitesurfProbability >= 20
                          ? "#f97316"
                          : "#ef4444",
              }}
            >
              {getProbabilityText(kitesurfProbability)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-white/40 text-right">
        Data source: {error ? "Estimated (offline)" : "Live API"}
      </div>
    </motion.div>
  )
}
