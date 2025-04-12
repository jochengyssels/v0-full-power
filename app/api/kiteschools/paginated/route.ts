import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const search = searchParams.get("search") || ""
    const country = searchParams.get("country") || ""
    const continent = searchParams.get("continent") || "" // New continent filter
    const minRating = searchParams.get("minRating") || ""
    const priceRange = searchParams.get("priceRange") || ""

    // Calculate offset
    const offset = (page - 1) * limit

    // Build the query
    let query = supabase.from("kiteschools").select("*", { count: "exact" })

    // Apply filters if provided
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,location.ilike.%${search}%,owner_name.ilike.%${search}%`)
    }

    if (country) {
      query = query.eq("country", country)
    }

    // Apply continent filter
    if (continent) {
      query = query.eq("continent", continent)
    }

    if (minRating) {
      const rating = Number.parseFloat(minRating.replace("+", ""))
      query = query.gte("google_review_score", rating)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order("company_name")

    // Execute the query
    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching kiteschools:", error)
      return NextResponse.json({ error: "Failed to fetch kiteschools" }, { status: 500 })
    }

    // Process the data to ensure uniqueness by company_name and country
    const uniqueSchools: Record<string, any> = {}

    data?.forEach((school) => {
      const key = `${school.company_name}-${school.country}`
      if (!uniqueSchools[key]) {
        uniqueSchools[key] = school
      }
    })

    const uniqueSchoolsArray = Object.values(uniqueSchools)

    // Calculate total pages based on unique schools
    const totalItems = count || uniqueSchoolsArray.length
    const totalPages = Math.ceil(totalItems / limit)

    // Fetch country counts
    // First, get unique countries
    const { data: uniqueCountries, error: uniqueCountriesError } = await supabase
      .from("kiteschools")
      .select("country")
      .order("country")

    if (uniqueCountriesError) {
      console.error("Error fetching unique countries:", uniqueCountriesError)
    }

    // Then count kiteschools for each country
    const countryCountsMap = {}
    if (uniqueCountries) {
      const uniqueCountryValues = [...new Set(uniqueCountries.map((item) => item.country))]

      for (const countryName of uniqueCountryValues) {
        if (countryName) {
          // Skip null or empty country names
          const { count, error: countError } = await supabase
            .from("kiteschools")
            .select("*", { count: "exact", head: true })
            .eq("country", countryName)

          if (!countError) {
            countryCountsMap[countryName] = count || 0
          }
        }
      }
    }

    // Fetch continent counts
    const { data: uniqueContinents, error: uniqueContinentsError } = await supabase
      .from("kiteschools")
      .select("continent")
      .order("continent")

    if (uniqueContinentsError) {
      console.error("Error fetching unique continents:", uniqueContinentsError)
    }

    // Then count kiteschools for each continent
    const continentCountsMap = {}
    if (uniqueContinents) {
      const uniqueContinentValues = [...new Set(uniqueContinents.map((item) => item.continent))]

      for (const continentName of uniqueContinentValues) {
        if (continentName) {
          // Skip null or empty continent names
          const { count, error: countError } = await supabase
            .from("kiteschools")
            .select("*", { count: "exact", head: true })
            .eq("continent", continentName)

          if (!countError) {
            continentCountsMap[continentName] = count || 0
          }
        }
      }
    }

    return NextResponse.json({
      schools: uniqueSchoolsArray,
      page,
      limit,
      totalItems,
      totalPages,
      countryCounts: countryCountsMap, // Include country counts in the response
      continentCounts: continentCountsMap, // Include continent counts in the response
    })
  } catch (error) {
    console.error("Unexpected error in kiteschools paginated API route:", error)
    return NextResponse.json({ error: "Failed to fetch kiteschools", details: String(error) }, { status: 500 })
  }
}
