"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { MapPin, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react"
import NavigationBar from "@/components/navigation-bar"
import KiteschoolsMap from "@/components/kiteschools-map"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Add this after the imports at the top of the file
const bgPatternStyle = {
  backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
  backgroundSize: `20px 20px`,
}

// Define the kiteschool type
interface Kiteschool {
  id: string
  company_name: string
  location: string
  country: string
  continent: string
  google_review_score: string | null
  owner_name: string | null
  website_url: string | null
  course_pricing: string | null
  logo_url: string | null
}

// View modes
type ViewMode = "grid" | "list" | "map"

export default function KiteschoolsPage() {
  // State
  const [kiteschools, setKiteschools] = useState<Kiteschool[]>([])
  const [filteredSchools, setFilteredSchools] = useState<Kiteschool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareList, setCompareList] = useState<Kiteschool[]>([])
  const [expandedSchools, setExpandedSchools] = useState<string[]>([])

  // Add these state variables after the other state declarations
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    continents: [] as { name: string; count: number }[],
    countries: [] as { name: string; count: number }[],
    priceRanges: ["$", "$$", "$$$"],
    ratings: ["4.5+", "4.0+", "3.5+", "Any"],
  })

  const [activeFilters, setActiveFilters] = useState({
    continent: null as string | null,
    country: null as string | null,
    priceRange: null as string | null,
    rating: null as string | null,
  })

  // Router and search params
  // const router = useRouter()
  // const searchParams = useSearchParams()

  // Fetch kiteschools data
  async function fetchKiteschools() {
    setLoading(true)
    setError(null)

    try {
      // Build query params for filters
      const params = new URLSearchParams()
      if (activeFilters.country) params.append("country", activeFilters.country)
      if (activeFilters.continent) params.append("continent", activeFilters.continent) // Add continent filter

      // Use the new paginated API endpoint
      const response = await fetch(`/api/kiteschools/paginated?page=${currentPage}&limit=50&${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch kiteschools: ${response.status}`)
      }

      const data = await response.json()

      setKiteschools(data.schools)
      setTotalPages(data.totalPages)

      // Extract unique countries for filters
      const countries = Object.entries(data.countryCounts || {}).map(([name, count]) => ({
        name,
        count: count as number,
      }))

      // Extract unique continents for filters
      const continents = Object.entries(data.continentCounts || {}).map(([name, count]) => ({
        name,
        count: count as number,
      }))

      setFilters((prev) => ({
        ...prev,
        countries: countries,
        continents: continents,
      }))
    } catch (err) {
      console.error("Error fetching kiteschools:", err instanceof Error ? err.message : String(err))
      setError(err instanceof Error ? err.message : "Failed to fetch kiteschools")
    } finally {
      setLoading(false)
    }
  }

  // Filter kiteschools based on search query and active filters
  useEffect(() => {
    if (!kiteschools.length) {
      setFilteredSchools([])
      return
    }

    let filtered = [...kiteschools]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (school) =>
          school.company_name.toLowerCase().includes(query) ||
          school.location.toLowerCase().includes(query) ||
          school.country.toLowerCase().includes(query) ||
          (school.owner_name && school.owner_name.toLowerCase().includes(query)),
      )
    }

    // Apply country filter
    if (activeFilters.country) {
      filtered = filtered.filter((school) => school.country === activeFilters.country)
    }

    // Apply continent filter
    if (activeFilters.continent) {
      filtered = filtered.filter((school) => school.continent === activeFilters.continent)
    }

    // Apply price range filter
    if (activeFilters.priceRange) {
      const priceLevel = activeFilters.priceRange.length // Number of $ signs
      filtered = filtered.filter((school) => {
        // Convert price range to number of $ signs
        const schoolPriceLevel = getPriceLevel(school.course_pricing)
        return schoolPriceLevel <= priceLevel
      })
    }

    // Apply rating filter
    if (activeFilters.rating && activeFilters.rating !== "Any") {
      const minRating = Number.parseFloat(activeFilters.rating.replace("+", ""))
      filtered = filtered.filter((school) => {
        const rating = Number.parseFloat(school.google_review_score || "0")
        return rating >= minRating
      })
    }

    setFilteredSchools(filtered)
  }, [kiteschools, searchQuery, activeFilters])

  // Add this useEffect after the other useEffects
  useEffect(() => {
    fetchKiteschools()
  }, [currentPage])

  // Helper function to get price level (number of $ signs)
  const getPriceLevel = (pricing: string | null): number => {
    if (!pricing) return 2 // Default to medium price

    const numericValue = Number.parseInt(pricing.replace(/[^0-9]/g, ""))

    if (numericValue < 100) return 1 // $
    if (numericValue < 300) return 2 // $
    return 3 // $
  }

  // Render price range as $ symbols
  const renderPriceRange = (pricing: string | null): string => {
    const level = getPriceLevel(pricing)
    return "$".repeat(level)
  }

  // Handle school selection
  const handleSchoolSelect = (schoolId: string) => {
    const school = kiteschools.find((s) => s.id === schoolId)
    if (school) {
      setSelectedSchool(school)
    }
  }

  // Toggle expanded state for a school
  const toggleExpanded = (schoolId: string) => {
    if (expandedSchools.includes(schoolId)) {
      setExpandedSchools(expandedSchools.filter((id) => id !== schoolId))
    } else {
      setExpandedSchools([...expandedSchools, schoolId])
    }
  }

  // Handle compare toggle
  const handleCompareToggle = (school: Kiteschool) => {
    if (compareList.some((item) => item.id === school.id)) {
      // Remove from compare list
      setCompareList(compareList.filter((item) => item.id !== school.id))
    } else {
      // Add to compare list (max 3)
      if (compareList.length < 3) {
        setCompareList([...compareList, school])
      }
    }
  }

  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      continent: null,
      country: null,
      priceRange: null,
      rating: null,
    })
    setSearchQuery("")
  }

  // Render list view
  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredSchools.map((school) => (
          <motion.div
            key={school.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-xl transition-all hover:border-slate-600/50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo */}
              <div className="relative h-32 md:h-48 flex items-center justify-center">
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                  {school.logo_url ? (
                    <Image
                      src={school.logo_url || "/placeholder.svg"}
                      alt={school.company_name}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{school.company_name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* School info */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{school.company_name}</h3>
                <div className="flex items-center text-white/70 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1 text-sky-400" />
                  <span className="truncate">
                    {school.location}, {school.country}
                  </span>
                </div>

                {/* Rating and price */}
                <div className="flex justify-between items-center mb-4">
                  {school.google_review_score ? (
                    <div className="flex items-center bg-amber-500/20 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                      <span className="text-amber-300 text-xs font-medium">{school.google_review_score}</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-slate-700/50 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-white/40 mr-1" />
                      <span className="text-white/40 text-xs">No ratings</span>
                    </div>
                  )}

                  <div className="text-green-400 font-medium text-sm">{renderPriceRange(school.course_pricing)}</div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {school.owner_name && (
                    <div className="flex items-center text-white/70 text-xs bg-slate-700/30 rounded-lg p-2">
                      <svg
                        className="w-3.5 h-3.5 text-blue-400 mr-1.5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span className="truncate">{school.owner_name}</span>
                    </div>
                  )}

                  <div className="flex items-center text-white/70 text-xs bg-slate-700/30 rounded-lg p-2">
                    <svg
                      className="w-3.5 h-3.5 text-purple-400 mr-1.5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                    <span className="truncate">Certified</span>
                  </div>

                  <div className="flex items-center text-white/70 text-xs bg-slate-700/30 rounded-lg p-2">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-400 mr-1.5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span className="truncate">Video Analysis</span>
                  </div>

                  <div className="flex items-center text-white/70 text-xs bg-slate-700/30 rounded-lg p-2">
                    <svg
                      className="w-3.5 h-3.5 text-amber-400 mr-1.5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span className="truncate">{school.course_pricing || "Pricing varies"}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleExpanded(school.id)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    {expandedSchools.includes(school.id) ? "Show Less" : "Show More"}
                  </button>
                  <button
                    onClick={() => handleCompareToggle(school)}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
                      compareList.some((item) => item.id === school.id)
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-white",
                    )}
                  >
                    {compareList.some((item) => item.id === school.id) ? "Remove" : "Compare"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  const renderPaginationComponent = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoadingPage}
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show 5 page numbers centered around current page
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === pageNum
                    ? "bg-sky-500 text-white"
                    : "bg-slate-700 text-white/70 hover:bg-slate-600 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoadingPage}
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    )
  }

  // Add continent filter options
  const continentOptions = filters.continents.map((continent) => continent.name)

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )
    }

    if (error) {
      return <div className="text-red-500">Error: {error}</div>
    }

    if (filteredSchools.length === 0) {
      return <div className="text-white/70">No kiteschools found.</div>
    }

    switch (viewMode) {
      case "list":
        return renderListView()
      case "map":
        return <KiteschoolsMap schools={filteredSchools} onSchoolSelect={handleSchoolSelect} />
      default:
        return renderListView()
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Kitesurfing Schools</h1>
            <p className="text-white/70">
              Find the perfect kitesurfing school to learn or improve your skills with professional instructors.
            </p>
          </div>

          {/* Dashboard Stats */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Kiteschool Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Total Schools */}
              <div className="bg-slate-700/50 rounded-lg p-4 flex items-center">
                <div className="bg-sky-500/20 p-3 rounded-full mr-3">
                  <svg
                    className="w-6 h-6 text-sky-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Schools</p>
                  <p className="text-2xl font-bold text-white">{kiteschools.length}</p>
                </div>
              </div>

              {/* Schools by Continent */}
              <div className="bg-slate-700/50 rounded-lg p-4 flex items-center">
                <div className="bg-emerald-500/20 p-3 rounded-full mr-3">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Continents</p>
                  <p className="text-2xl font-bold text-white">{filters.continents.length}</p>
                </div>
              </div>

              {/* Countries */}
              <div className="bg-slate-700/50 rounded-lg p-4 flex items-center">
                <div className="bg-purple-500/20 p-3 rounded-full mr-3">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Countries</p>
                  <p className="text-2xl font-bold text-white">{filters.countries.length}</p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/80 mb-3">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  // Calculate number of schools with this rating
                  const count = kiteschools.filter((school) => {
                    const schoolRating = Number.parseFloat(school.google_review_score || "0")
                    return schoolRating >= rating && schoolRating < rating + 1
                  }).length

                  // Calculate percentage
                  const percentage = kiteschools.length > 0 ? (count / kiteschools.length) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center">
                      <div className="flex items-center w-16">
                        <span className="text-white/80 text-sm mr-1">{rating}</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="flex-1 h-5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="text-white/80 text-sm ml-2 w-10 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-3">Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 hover:border-sky-500/30 transition-colors cursor-pointer">
                  <h4 className="text-white text-sm font-medium mb-1">Featured Schools</h4>
                  <p className="text-white/60 text-xs">Discover our top-rated kiteschools with exceptional reviews</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 hover:border-sky-500/30 transition-colors cursor-pointer">
                  <h4 className="text-white text-sm font-medium mb-1">Popular Locations</h4>
                  <p className="text-white/60 text-xs">Explore the most popular kitesurfing destinations worldwide</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 hover:border-sky-500/30 transition-colors cursor-pointer">
                  <h4 className="text-white text-sm font-medium mb-1">Course Comparison</h4>
                  <p className="text-white/60 text-xs">Compare courses, prices, and offerings between schools</p>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Filters */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg mb-6">
            <div className="flex flex-wrap gap-3">
              {/* Continent Filters */}
              {filters.continents.map((continent) => (
                <button
                  key={continent.name}
                  onClick={() => setActiveFilters({ ...activeFilters, continent: continent.name, country: null })}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs",
                    activeFilters.continent === continent.name
                      ? "bg-sky-500 text-white"
                      : "bg-slate-700/50 text-white/70 hover:text-white",
                  )}
                >
                  {continent.name} ({continent.count})
                </button>
              ))}

              {/* Country Filters */}
              {filters.countries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => setActiveFilters({ ...activeFilters, country: country.name })}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs",
                    activeFilters.country === country.name
                      ? "bg-sky-500 text-white"
                      : "bg-slate-700/50 text-white/70 hover:text-white",
                  )}
                >
                  {country.name} ({country.count})
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          {renderContent()}
          {!loading && !error && filteredSchools.length > 0 && renderPaginationComponent()}
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
