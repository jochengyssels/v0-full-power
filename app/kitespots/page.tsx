"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { Search, Wind, Waves, Droplets, Info, Star, Calendar, MapPin, ChevronRight, Loader2 } from "lucide-react"
import NavigationBar from "@/components/navigation-bar"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabase"

// Dynamically import the map component to avoid SSR issues
const KitespotsMap = dynamic(() => import("@/components/kitespots-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-sky-100/30 rounded-xl flex items-center justify-center">
      <div className="animate-pulse text-white">Loading map...</div>
    </div>
  ),
})

// Types for kitespot data
interface Kitespot {
  id: string
  name: string
  country: string
  location?: string
  latitude: number
  longitude: number
  difficulty: string
  water_type: string
  rating?: number
  wind_reliability?: number
  wave_height?: number
  water_temp?: number
  best_season?: string[]
  image_url?: string
  images?: string[] // Array of image URLs
}

interface KitespotCardProps {
  kitespot: Kitespot
  onClick?: (kitespot: Kitespot) => void
  isCompareMode?: boolean
}

const KitespotCard: React.FC<KitespotCardProps> = ({ kitespot, onClick, isCompareMode = false }) => {
  // Render wind reliability indicators
  const renderWindIndicators = (reliability: number) => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div
          key={`wind-${i}`}
          className={cn(
            "w-2 h-6 rounded-full transition-all",
            i < reliability ? "bg-gradient-to-t from-blue-500 to-sky-400" : "bg-gray-200 dark:bg-gray-700",
          )}
        />
      ))
  }

  // Render wave height indicators
  const renderWaveIndicators = (height: number) => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div
          key={`wave-${i}`}
          className={cn(
            "w-2 h-6 rounded-full transition-all",
            i < height ? "bg-gradient-to-t from-teal-500 to-emerald-400" : "bg-gray-200 dark:bg-gray-700",
          )}
          style={{ height: `${(i + 1) * 6 + 6}px` }}
        />
      ))
  }

  // Render water temperature indicators
  const renderTempIndicators = (temp: number) => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div
          key={`temp-${i}`}
          className={cn(
            "w-2 h-6 rounded-full transition-all",
            i < temp ? "bg-gradient-to-t from-amber-500 to-yellow-400" : "bg-gray-200 dark:bg-gray-700",
          )}
        />
      ))
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string | null | undefined) => {
    if (!difficulty) return "bg-blue-500" // Default color for null/undefined

    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-500"
      case "intermediate":
        return "bg-amber-500"
      case "advanced":
        return "bg-rose-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get season months
  const getSeasonMonths = () => {
    if (kitespot.best_season && Array.isArray(kitespot.best_season)) {
      return kitespot.best_season
    }

    // Generate random season if not available
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const startMonth = Math.floor(Math.random() * 6) // Random start month
    const seasonLength = Math.floor(Math.random() * 4) + 3 // Season length between 3-6 months

    return allMonths.slice(startMonth, startMonth + seasonLength)
  }

  const seasonMonths = getSeasonMonths()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-xl transition-all group"
    >
      <div className="relative h-64 w-full overflow-hidden">
        {/* Main image */}
        <Image
          src={kitespot.image_url || "/vibrant-kitesurfing-scene.png"}
          alt={kitespot.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center shadow-md">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
          <span className="text-sm font-semibold">{kitespot.rating}</span>
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-medium text-white px-2.5 py-1 rounded-full ${getDifficultyColor(kitespot.difficulty)} shadow-md`}
          >
            {kitespot.difficulty || "Unknown"}
          </span>
        </div>

        {/* Location info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{kitespot.name}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">
              {kitespot.country}, {kitespot.location}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Indicators section */}
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Wind</span>
            <div className="flex space-x-1.5">{renderWindIndicators(kitespot.wind_reliability || 0)}</div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Waves</span>
            <div className="flex space-x-1.5 items-end">{renderWaveIndicators(kitespot.wave_height || 0)}</div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Temp</span>
            <div className="flex space-x-1.5">{renderTempIndicators(kitespot.water_temp || 0)}</div>
          </div>
        </div>

        {/* Season section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Season</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {seasonMonths.map((month) => (
              <span
                key={month}
                className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded"
              >
                {month}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isCompareMode && onClick ? (
            <button
              onClick={() => onClick(kitespot)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              Remove from Compare
            </button>
          ) : (
            <>
              <Link
                href={`/?location=${encodeURIComponent(`${kitespot.name}, ${kitespot.country}`)}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>

              {onClick && (
                <button
                  onClick={() => onClick(kitespot)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Compare
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function KitespotsPage() {
  const [kitespots, setKitespots] = useState<Kitespot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<Kitespot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    difficulty: null as string | null,
    waterType: null as string | null,
    continent: null as string | null,
  })
  const [selectedSpot, setSelectedSpot] = useState<Kitespot | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareList, setCompareList] = useState<any[]>([])
  const mapRef = useRef<HTMLDivElement>(null)
  const [spotImages, setSpotImages] = useState<Record<string, string[]>>({})

  // Filter states
  const [filters, setFilters] = useState<{
    countries: string[]
    difficulties: string[]
    waterTypes: string[]
  }>({
    countries: [],
    difficulties: [],
    waterTypes: [],
  })

  const [showFilters, setShowFilters] = useState(false)
  const [selectedKitespot, setSelectedKitespot] = useState<any | null>(null)

  // Fetch kitespots data and their images
  useEffect(() => {
    const fetchKitespots = async () => {
      setLoading(true)
      try {
        // Fetch kitespots
        const response = await fetch("/api/kite-spots")
        if (!response.ok) {
          throw new Error("Failed to fetch kitespots")
        }
        const data = await response.json()

        // Fetch images from kitespot_images table
        const { data: imagesData, error: imagesError } = await supabase.from("kitespot_images").select("*")

        if (imagesError) {
          console.error("Error fetching kitespot images:", imagesError)
        }

        // Organize images by kitespot_id
        const imagesBySpotId: Record<string, string[]> = {}
        if (imagesData) {
          imagesData.forEach((img: any) => {
            if (!imagesBySpotId[img.kitespot_id]) {
              imagesBySpotId[img.kitespot_id] = []
            }
            imagesBySpotId[img.kitespot_id].push(img.image_url)
          })
        }

        setSpotImages(imagesBySpotId)

        // Add mock ratings and additional data for the demo
        const spotsWithRatings = data.kitespots.map((spot: any) => {
          // Find images for this spot
          const spotImageUrls = imagesBySpotId[spot.id] || []

          return {
            ...spot,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
            wind_reliability: Math.floor(Math.random() * 3) + 1, // 1-3 wind icons
            wave_height: Math.floor(Math.random() * 3) + 1, // 1-3 wave icons
            water_temp: Math.floor(Math.random() * 3) + 1, // 1-3 temperature icons
            // Use first image from kitespot_images if available, otherwise fallback
            image_url: spotImageUrls.length > 0 ? spotImageUrls[0] : getKitespotImage(spot.name),
            images: spotImageUrls,
            // Generate random best season
            best_season: generateRandomSeason(),
          }
        })

        setKitespots(spotsWithRatings)
        setFilteredSpots(spotsWithRatings)
      } catch (error) {
        console.error("Error fetching kitespots:", error)
        // Use mock data as fallback
        const mockData = generateMockKitespots()
        setKitespots(mockData)
        setFilteredSpots(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchKitespots()
  }, [])

  // Generate random season months
  const generateRandomSeason = () => {
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const startMonth = Math.floor(Math.random() * 6) // Random start month
    const seasonLength = Math.floor(Math.random() * 4) + 3 // Season length between 3-6 months

    return allMonths.slice(startMonth, startMonth + seasonLength)
  }

  // Filter kitespots based on search and filters
  useEffect(() => {
    if (!kitespots.length) return

    let filtered = [...kitespots]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (spot) =>
          spot.name.toLowerCase().includes(query) ||
          spot.country.toLowerCase().includes(query) ||
          (spot.location?.toLowerCase().includes(query) ?? false),
      )
    }

    // Apply difficulty filter
    if (activeFilters.difficulty) {
      filtered = filtered.filter((spot) => spot.difficulty === activeFilters.difficulty)
    }

    // Apply water type filter
    if (activeFilters.waterType) {
      filtered = filtered.filter((spot) => spot.water_type === activeFilters.waterType)
    }

    // Apply continent filter (would need to add continent data to spots)
    if (activeFilters.continent) {
      // This is a placeholder - you would need to add continent data to your spots
      filtered = filtered.filter((spot) => getContinent(spot.country) === activeFilters.continent)
    }

    setFilteredSpots(filtered)
  }, [kitespots, searchQuery, activeFilters])

  // Helper function to get a kitespot image
  const getKitespotImage = (name: string) => {
    const kitespotImages: Record<string, string> = {
      Tarifa: "/images/tarifa-kitesurfing.png",
      Cabarete: "/images/cabarete-kitesurfing.png",
      Dakhla: "/images/dakhla-kitesurfing.png",
      Jericoacoara: "/images/jericoacoara-kitesurfing.png",
      "Cape Town": "/images/cape-town-kitesurfing.png",
      "Punta Trettu": "/images/punta-trettu-kitesurfing.png",
    }

    // Find a matching image or use a default
    for (const [key, value] of Object.entries(kitespotImages)) {
      if (name.includes(key)) {
        return value
      }
    }

    // Default image
    return "/vibrant-kitesurfing-scene.png"
  }

  // Helper function to get continent from country (simplified)
  const getContinent = (country: string) => {
    const continentMap: Record<string, string> = {
      Spain: "Europe",
      Italy: "Europe",
      Germany: "Europe",
      France: "Europe",
      Morocco: "Africa",
      "South Africa": "Africa",
      Egypt: "Africa",
      Brazil: "South America",
      "Dominican Republic": "North America",
      "United States": "North America",
      Mexico: "North America",
      Philippines: "Asia",
      Vietnam: "Asia",
      Thailand: "Asia",
      Australia: "Oceania",
      "New Zealand": "Oceania",
    }

    return continentMap[country] || "Unknown"
  }

  // Generate mock kitespots data
  const generateMockKitespots = (): Kitespot[] => {
    return [
      {
        id: "1",
        name: "Tarifa",
        country: "Spain",
        location: "Andalusia",
        latitude: 36.0143,
        longitude: -5.6044,
        difficulty: "intermediate",
        water_type: "choppy",
        rating: 4.7,
        wind_reliability: 3,
        wave_height: 2,
        water_temp: 2,
        image_url: "/images/tarifa-kitesurfing.png",
        best_season: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      },
      {
        id: "2",
        name: "Cabarete",
        country: "Dominican Republic",
        location: "Puerto Plata",
        latitude: 19.758,
        longitude: -70.4193,
        difficulty: "intermediate",
        water_type: "waves",
        rating: 4.5,
        wind_reliability: 3,
        wave_height: 2,
        water_temp: 3,
        image_url: "/images/cabarete-kitesurfing.png",
        best_season: ["Jun", "Jul", "Aug", "Sep"],
      },
      {
        id: "3",
        name: "Dakhla",
        country: "Morocco",
        location: "Western Sahara",
        latitude: 23.7136,
        longitude: -15.9355,
        difficulty: "beginner",
        water_type: "flat",
        rating: 4.6,
        wind_reliability: 3,
        wave_height: 1,
        water_temp: 2,
        image_url: "/images/dakhla-kitesurfing.png",
        best_season: ["Mar", "Apr", "May", "Jun", "Jul"],
      },
      {
        id: "4",
        name: "Cape Town",
        country: "South Africa",
        location: "Western Cape",
        latitude: -33.9249,
        longitude: 18.4241,
        difficulty: "advanced",
        water_type: "waves",
        rating: 4.8,
        wind_reliability: 3,
        wave_height: 3,
        water_temp: 1,
        image_url: "/images/cape-town-kitesurfing.png",
        best_season: ["Nov", "Dec", "Jan", "Feb"],
      },
      {
        id: "5",
        name: "Boracay",
        country: "Philippines",
        location: "Aklan",
        latitude: 11.9674,
        longitude: 121.9248,
        difficulty: "beginner",
        water_type: "flat",
        rating: 4.2,
        wind_reliability: 2,
        wave_height: 1,
        water_temp: 3,
        image_url: "/vibrant-kitesurfing-scene.png",
        best_season: ["Dec", "Jan", "Feb", "Mar"],
      },
      {
        id: "6",
        name: "Sylt",
        country: "Germany",
        location: "North Sea",
        latitude: 54.9079,
        longitude: 8.3273,
        difficulty: "intermediate",
        water_type: "choppy",
        rating: 4.6,
        wind_reliability: 3,
        wave_height: 2,
        water_temp: 1,
        image_url: "/vibrant-kitesurfing-scene.png",
        best_season: ["May", "Jun", "Jul", "Aug"],
      },
    ]
  }

  // Handle kitespot selection
  const handleKitespotSelect = (kitespot: any) => {
    setSelectedKitespot(kitespot)
  }

  // Handle compare toggle
  const handleCompareToggle = (kitespot: any) => {
    if (compareList.some((item) => item.id === kitespot.id)) {
      // Remove from compare list
      setCompareList(compareList.filter((item) => item.id !== kitespot.id))
    } else {
      // Add to compare list (max 3)
      if (compareList.length < 3) {
        setCompareList([...compareList, kitespot])
      }
    }
  }

  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      difficulty: null,
      waterType: null,
      continent: null,
    })
    setSearchQuery("")
  }

  // Render content based on view mode
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <span className="ml-2 text-white">Loading kitespots...</span>
        </div>
      )
    }

    if (filteredSpots.length === 0 && !loading) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No kitespots found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("")
              setActiveFilters({ difficulty: null, waterType: null, continent: null })
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )
    }

    if (compareMode && compareList.length > 0) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Comparing {compareList.length} Kitespots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareList.map((kitespot) => (
                <KitespotCard
                  key={kitespot.id}
                  kitespot={kitespot}
                  onClick={() => handleCompareToggle(kitespot)}
                  isCompareMode={true}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setCompareMode(false)
                setCompareList([])
              }}
              className="mt-4 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Exit Compare Mode
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSpots.slice(0, 6).map((spot) => (
          <KitespotCard key={spot.id} kitespot={spot} onClick={() => handleCompareToggle(spot)} />
        ))}
      </div>
    )
  }

  return (
    <>
      <NavigationBar />

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <Image src="/turquoise-kite.png" alt="Kitesurfing" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/70"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Explore the World's Best
            <br />
            Kitesurfing Spots
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl"
          >
            Discover data-rich insights and interactive features
            <br />
            to plan your kitesurf adventures.
          </motion.p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Interactive Kitespot Map</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore kitesurfing spots around the world. Click on a marker to see details or use the search to find
              specific locations.
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-xl p-4 md:p-8 relative">
            <div ref={mapRef} className="w-full h-[500px] rounded-lg overflow-hidden">
              <KitespotsMap
                kitespots={filteredSpots}
                onKitespotSelect={handleKitespotSelect}
                selectedSpots={selectedKitespot ? [selectedKitespot.id] : []}
              />
            </div>

            {/* Search and filters overlay */}
            <div className="absolute top-8 left-8 max-w-xs w-full z-10">
              <div className="bg-white rounded-lg shadow-lg p-4 border border-blue-100">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search kitespots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                    <button onClick={resetFilters} className="text-xs text-blue-500 hover:text-blue-700 font-medium">
                      Reset
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={activeFilters.difficulty || ""}
                      onChange={(e) => setActiveFilters({ ...activeFilters, difficulty: e.target.value || null })}
                      className="text-xs border border-blue-200 rounded-full px-3 py-1.5 bg-white hover:border-blue-300 transition-colors"
                    >
                      <option value="">All Difficulties</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>

                    <select
                      value={activeFilters.waterType || ""}
                      onChange={(e) => setActiveFilters({ ...activeFilters, waterType: e.target.value || null })}
                      className="text-xs border border-blue-200 rounded-full px-3 py-1.5 bg-white hover:border-blue-300 transition-colors"
                    >
                      <option value="">All Water Types</option>
                      <option value="flat">Flat</option>
                      <option value="choppy">Choppy</option>
                      <option value="waves">Waves</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected spot info */}
            {selectedKitespot && (
              <div className="absolute bottom-8 right-8 max-w-xs w-full z-10 bg-white rounded-lg shadow-lg p-4 border border-blue-100">
                <h3 className="font-bold text-gray-800 mb-1">{selectedKitespot.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{selectedKitespot.country}</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Wind className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="capitalize">{selectedKitespot.difficulty || "Intermediate"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Waves className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="capitalize">{selectedKitespot.water_type || "Various"}</span>
                </div>
                <Link
                  href={`/?location=${encodeURIComponent(`${selectedKitespot.name}, ${selectedKitespot.country}`)}`}
                  className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block w-full text-center"
                >
                  View Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Kitespots Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Kitespots</h2>

          {renderContent()}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start">
              <Info className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">About Our Kitespot Ratings</h3>
                <p className="text-gray-700 mb-4">
                  Our kitespot ratings are based on a combination of factors including wind reliability, wave
                  conditions, water temperature, and user reviews. The indicators help you quickly assess if a spot
                  matches your preferences:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <Wind className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Wind Reliability</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Indicates how consistent and reliable the wind conditions are throughout the season.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <Waves className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Wave Conditions</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Shows the typical wave height and conditions you can expect at this location.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Water Temperature</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Indicates the average water temperature during the kitesurfing season.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ExternalLink(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
