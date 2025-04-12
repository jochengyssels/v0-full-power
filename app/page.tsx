"use client"

import { useState, useEffect } from "react"
import KiteSpotFinder from "@/components/kite-spot-finder"
import WeatherTiles from "@/components/weather-tiles"
import ForecastChart from "@/components/forecast-chart"
import GoldenKiteWindow from "@/components/golden-kite-window"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import CustomWeatherWidget from "@/components/custom-weather-widget"
import NavigationBar from "@/components/navigation-bar"
import { recordSpotInteraction } from "@/lib/api-service-interactions"
import { supabase } from "@/lib/supabaseClient"
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Wind,
  Compass,
  Thermometer,
  Clock,
  Sun,
  Cloud,
  Droplets,
  Ruler,
} from "lucide-react"

// Update the locationData object to use IDs instead of names
const locationData: Record<string, { windSpeed: number; lat: number; lon: number }> = {
  "Punta Trettu, Italy": { windSpeed: 14, lat: 39.1833, lon: 8.3167 },
  "Tarifa, Spain": { windSpeed: 18, lat: 36.0143, lon: -5.6044 },
  "Maui, Hawaii": { windSpeed: 15, lat: 20.7984, lon: -156.3319 },
  "Cape Town, South Africa": { windSpeed: 22, lat: -33.9249, lon: 18.4241 },
  "Cabarete, Dominican Republic": { windSpeed: 14, lat: 19.758, lon: -70.4193 },
  "Dakhla, Morocco": { windSpeed: 20, lat: 23.7136, lon: -15.9355 },
  "Jericoacoara, Brazil": { windSpeed: 16, lat: -2.7975, lon: -40.5137 },
  "Essaouira, Morocco": { windSpeed: 17, lat: 31.5085, lon: -9.7595 },
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [currentWindSpeed, setCurrentWindSpeed] = useState<number>(15)
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)

  // Add state for weather data and kitespot images
  const [weatherData, setWeatherData] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [kitespotImages, setKitespotImages] = useState<any[]>([])
  const [imagesLoading, setImagesLoading] = useState<boolean>(false)

  useEffect(() => {
    // Set default coordinates for Tarifa if no location is selected
    if (!selectedLocation) {
      setCoordinates({ lat: 36.0143, lon: -5.6044 }) // Tarifa, Spain
    }
  }, [selectedLocation])

  // Add useEffect to fetch weather data and images from Supabase when location changes
  useEffect(() => {
    if (!selectedLocation || !coordinates) return

    const fetchWeatherData = async () => {
      setWeatherLoading(true)
      setWeatherError(null)
      setImagesLoading(true)

      try {
        // First, find the kitespot ID based on the name
        const { data: kitespotData, error: kitespotError } = await supabase
          .from("kitespots")
          .select("id, name")
          .ilike("name", `%${selectedLocation.split(",")[0].trim()}%`)
          .limit(1)

        if (kitespotError || !kitespotData || kitespotData.length === 0) {
          console.log("No matching kitespot found in database for:", selectedLocation)
          // Continue with API fallback
        } else {
          console.log("Found kitespot in database:", kitespotData[0])
          const kitespotId = kitespotData[0].id

          // Fetch weather data from Supabase
          const { data: weatherDataResult, error: weatherError } = await supabase
            .from("weather_data")
            .select("*")
            .eq("spot_id", kitespotId)
            .order("timestamp", { ascending: false })
            .limit(1)

          if (weatherError) throw weatherError

          if (weatherDataResult && weatherDataResult.length > 0) {
            console.log("Weather data retrieved from Supabase:", weatherDataResult[0])
            setWeatherData(weatherDataResult[0])
          } else {
            // If no data in Supabase, fetch from API
            console.log("No weather data in Supabase, fetching from API...")
            const response = await fetch(`/api/kite-spots/weather?lat=${coordinates.lat}&lng=${coordinates.lon}`)
            if (!response.ok) throw new Error("Failed to fetch weather data from API")

            const apiData = await response.json()
            setWeatherData(apiData)
            console.log("Weather data retrieved from API:", apiData)
          }

          // Fetch images for this kitespot
          const { data: imagesData, error: imagesError } = await supabase
            .from("kitespot_images")
            .select("*")
            .eq("kitespot_id", kitespotId)

          if (imagesError) throw imagesError

          if (imagesData && imagesData.length > 0) {
            console.log("Images retrieved from Supabase:", imagesData)
            setKitespotImages(imagesData)
          } else {
            console.log("No images found for this kitespot")
            setKitespotImages([])
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setWeatherError(err instanceof Error ? err.message : "Failed to fetch data")
        setKitespotImages([])
      } finally {
        setWeatherLoading(false)
        setImagesLoading(false)
      }
    }

    fetchWeatherData()
  }, [selectedLocation, coordinates])

  // Update the handleLocationSelect function to handle geolocation errors gracefully
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)

    // Set wind speed and coordinates based on location
    if (location) {
      // Find a matching location in our data
      const locationKey = Object.keys(locationData).find((key) => {
        return (
          location.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(location.toLowerCase().split(",")[0].trim())
        )
      })

      if (locationKey) {
        const data = locationData[locationKey]
        setCurrentWindSpeed(data.windSpeed)
        setCoordinates({ lat: data.lat, lon: data.lon })

        // Record the interaction
        try {
          const mockId = btoa(locationKey).substring(0, 36) // Create a deterministic ID from the name
          recordSpotInteraction(mockId, "click").catch((err) =>
            console.error("Failed to record location selection interaction:", err),
          )
        } catch (err) {
          // Don't let tracking errors affect the user experience
          console.error("Error recording interaction:", err)
        }
      } else {
        // Default values if location not found
        console.warn(`No location data found for "${location}", using default values`)
        setCurrentWindSpeed(15)
        // Set default coordinates for Tarifa, Spain
        setCoordinates({ lat: 36.0143, lon: -5.6044 })
      }
    }
  }

  return (
    <>
      <NavigationBar />

      {/* Add padding to the main content to account for the fixed navbar */}
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 pt-16">
        <div className="absolute top-0 left-0 w-full h-64 bg-sky-600/10 -skew-y-6 transform-gpu z-0"></div>

        {/* Kite Schools Sidebar - only show when a location is selected */}

        <div className="relative z-10 w-full max-w-6xl px-4 py-6 flex flex-col min-h-[calc(100vh-3rem)] justify-between">
          <div className="flex-grow">
            <AnimatePresence>
              {!selectedLocation ? (
                // Initial centered layout
                <motion.div
                  key="centered-layout"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex flex-col items-center mb-4">
                    <Image
                      src="/logo-icon.png"
                      alt="Full Power Logo"
                      width={200}
                      height={200}
                      className="h-40 w-auto mb-1"
                    />
                    <h1 className="text-4xl font-bold text-white">Full Power</h1>
                    <p className="text-lg text-white/80 mt-1 mb-3">Advanced AI Forecasts for Unforgettable Rides</p>
                  </div>

                  <div className="w-full max-w-2xl">
                    <KiteSpotFinder onLocationSelect={handleLocationSelect} />
                  </div>
                  <div className="w-full max-w-2xl mt-4">
                    <CustomWeatherWidget />
                  </div>
                </motion.div>
              ) : (
                // Top bar layout after location is selected
                <motion.div
                  key="top-bar-layout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col w-full"
                >
                  <motion.div
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-4"
                  >
                    <div className="flex flex-col items-center mb-4 md:mb-0">
                      <Image
                        src="/logo-icon.png"
                        alt="Full Power Logo"
                        width={120}
                        height={120}
                        className="h-24 w-auto mr-3 cursor-pointer"
                        onClick={() => setSelectedLocation(null)}
                      />
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                      >
                        Fly back
                      </button>
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-white">Full Power</h1>
                        <div className="text-xl font-medium bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                          {selectedLocation}
                        </div>
                        <p className="text-sm text-white/80 mt-1">Advanced AI Forecasts for Unforgettable Rides</p>
                      </div>
                    </div>
                    <div className="w-full md:w-96">
                      <KiteSpotFinder onLocationSelect={handleLocationSelect} initialLocation={selectedLocation} />
                    </div>
                  </motion.div>

                  {/* Weather Widget */}
                  {selectedLocation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-full mb-6 overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-sky-600/90 to-blue-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-sky-500/30">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#weather-pattern)" />
                            <defs>
                              <pattern
                                id="weather-pattern"
                                patternUnits="userSpaceOnUse"
                                width="10"
                                height="10"
                                patternTransform="rotate(45)"
                              >
                                <rect width="6" height="6" fill="white" />
                              </pattern>
                            </defs>
                          </svg>
                        </div>

                        {/* Content */}
                        <div className="relative p-4">
                          {/* Header with location and status */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                            <div>
                              <h2 className="text-xl font-bold text-white flex items-center">
                                {weatherData?.temperature && (
                                  <span className="mr-2 text-2xl">{Math.round(weatherData.temperature)}°C</span>
                                )}
                                <span>Current Weather</span>
                              </h2>
                              <p className="text-sky-100/80 text-xs mt-0.5">
                                {new Date().toLocaleDateString(undefined, {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>

                            <div className="mt-1 md:mt-0">
                              {weatherLoading ? (
                                <div className="flex items-center bg-sky-800/50 px-2 py-1 rounded-full text-white/80">
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  <span className="text-xs">Updating...</span>
                                </div>
                              ) : weatherError ? (
                                <div className="flex items-center bg-amber-500/20 px-2 py-1 rounded-full text-amber-200">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Data error</span>
                                </div>
                              ) : (
                                <div className="flex items-center bg-emerald-500/20 px-2 py-1 rounded-full text-emerald-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span className="text-xs">
                                    {weatherData?.is_mock
                                      ? "Estimated data"
                                      : weatherData?.spot_id
                                        ? "Live data"
                                        : "API data"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Main weather display */}
                          {weatherData && (
                            <div className="flex flex-col md:flex-row">
                              {/* Left side - main weather info */}
                              <div className="flex-1 mb-2 md:mb-0 md:mr-4">
                                <div className="flex items-center">
                                  {/* Weather icon based on conditions */}
                                  <div className="mr-3 bg-white/10 p-2 rounded-xl">
                                    {weatherData.windSpeed > 20 ? (
                                      <Wind className="h-10 w-10 text-white" />
                                    ) : weatherData.temperature > 25 ? (
                                      <Sun className="h-10 w-10 text-yellow-300" />
                                    ) : (
                                      <Cloud className="h-10 w-10 text-white" />
                                    )}
                                  </div>

                                  <div>
                                    <div className="text-2xl font-bold text-white">
                                      {Math.round(weatherData.wind_speed_10m || weatherData.windSpeed || 0)}
                                      <span className="text-lg ml-1 font-normal text-white/80">knots</span>
                                    </div>
                                    <div className="text-sky-100/80 text-xs mt-0.5 flex items-center">
                                      <Compass className="h-3 w-3 mr-1" />
                                      <span>
                                        {Math.round(weatherData.wind_direction_10m || weatherData.windDirection || 0)}°
                                        {getWindDirectionText(
                                          Math.round(weatherData.wind_direction_10m || weatherData.windDirection || 0),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Last updated */}
                                <div className="mt-2 text-sky-100/60 text-xs flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Last updated:{" "}
                                  {weatherData.timestamp
                                    ? new Date(weatherData.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "Unknown"}
                                </div>
                              </div>

                              {/* Right side - weather details */}
                              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 flex-1">
                                <div className="bg-white/10 p-2 rounded-lg">
                                  <div className="text-sky-100/70 text-xs mb-0.5">Temperature</div>
                                  <div className="text-white text-sm font-medium flex items-center">
                                    <Thermometer className="h-4 w-4 text-red-300 mr-1" />
                                    {Math.round(weatherData.temperature || 0)}°C
                                  </div>
                                </div>

                                <div className="bg-white/10 p-2 rounded-lg">
                                  <div className="text-sky-100/70 text-xs mb-0.5">Wind Gusts</div>
                                  <div className="text-white text-sm font-medium flex items-center">
                                    <Wind className="h-4 w-4 text-yellow-300 mr-1" />
                                    {Math.round(weatherData.wind_gust || (weatherData.windSpeed || 0) * 1.3 || 0)} knots
                                  </div>
                                </div>

                                <div className="bg-white/10 p-2 rounded-lg">
                                  <div className="text-sky-100/70 text-xs mb-0.5">Humidity</div>
                                  <div className="text-white text-sm font-medium flex items-center">
                                    <Droplets className="h-4 w-4 text-blue-300 mr-1" />
                                    {Math.round(weatherData.humidity || 65)}%
                                  </div>
                                </div>

                                <div className="bg-white/10 p-2 rounded-lg">
                                  <div className="text-sky-100/70 text-xs mb-0.5">Kite Size</div>
                                  <div className="text-white text-sm font-medium flex items-center">
                                    <Ruler className="h-4 w-4 text-purple-300 mr-1" />
                                    {getRecommendedKiteSize(weatherData.wind_speed_10m || weatherData.windSpeed || 15)}
                                    m²
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Forecast hint */}
                          <div className="mt-3 pt-2 border-t border-sky-400/20 text-center">
                            <p className="text-sky-100/80 text-xs">
                              Scroll down for detailed forecast and golden kite window
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Kitespot Images Gallery */}
                  {selectedLocation && kitespotImages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="w-full mb-4 bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30"
                    >
                      <h2 className="text-lg font-semibold text-white mb-3">Kitespot Gallery</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {kitespotImages.map((image, index) => (
                          <div key={image.id} className="relative h-48 rounded-lg overflow-hidden">
                            <Image
                              src={image.image_url || "/placeholder.svg"}
                              alt={`${selectedLocation} - Image ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {imagesLoading && (
                    <div className="w-full mb-4 flex justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}

                  {selectedLocation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-full mb-6"
                    >
                      <CustomWeatherWidget
                        latitude={coordinates?.lat}
                        longitude={coordinates?.lon}
                        location={selectedLocation}
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <GoldenKiteWindow
                      location={selectedLocation}
                      windSpeed={currentWindSpeed}
                      latitude={coordinates?.lat}
                      longitude={coordinates?.lon}
                    >
                      <ForecastChart location={selectedLocation} />
                    </GoldenKiteWindow>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Weather tiles at the bottom */}
            <div className="mt-auto pt-4">
              <WeatherTiles onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// Helper function to get wind direction text
function getWindDirectionText(degrees: number): string {
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
  return ` (${directions[index]})`
}

// Helper function to get recommended kite size based on wind speed
function getRecommendedKiteSize(windSpeed: number): string {
  if (windSpeed < 10) return "12-14"
  if (windSpeed < 15) return "10-12"
  if (windSpeed < 20) return "8-10"
  if (windSpeed < 25) return "7-8"
  return "5-6"
}
