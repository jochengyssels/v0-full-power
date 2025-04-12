import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"
    const difficulty = searchParams.get("difficulty")
    const waterType = searchParams.get("waterType")
    const country = searchParams.get("country")

    // Start building the query
    let query = supabase.from("kitespots").select("*")

    // Apply filters if they exist
    if (difficulty) {
      query = query.eq("difficulty", difficulty)
    }

    if (waterType) {
      query = query.eq("water_type", waterType)
    }

    if (country) {
      query = query.eq("country", country)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Execute the query
    const { data, error } = await query

    if (error) {
      console.error("Error fetching kitespots:", error)
      return NextResponse.json({ error: "Failed to fetch kitespots" }, { status: 500 })
    }

    // Get unique countries, difficulties, and water types for filters
    const { data: countries, error: countriesError } = await supabase
      .from("kitespots")
      .select("country")
      .order("country")
      .is("country", "not", null)

    const { data: difficulties, error: difficultiesError } = await supabase
      .from("kitespots")
      .select("difficulty")
      .order("difficulty")
      .is("difficulty", "not", null)

    const { data: waterTypes, error: waterTypesError } = await supabase
      .from("kitespots")
      .select("water_type")
      .order("water_type")
      .is("water_type", "not", null)

    // Extract unique values
    const uniqueCountries = countries ? [...new Set(countries.map((item) => item.country))] : []
    const uniqueDifficulties = difficulties ? [...new Set(difficulties.map((item) => item.difficulty))] : []
    const uniqueWaterTypes = waterTypes ? [...new Set(waterTypes.map((item) => item.water_type))] : []

    return NextResponse.json({
      kitespots: data,
      filters: {
        countries: uniqueCountries,
        difficulties: uniqueDifficulties,
        waterTypes: uniqueWaterTypes,
      },
    })
  } catch (error) {
    console.error("Unexpected error in kitespots API route:", error)
    return NextResponse.json({ error: "Failed to fetch kitespots", details: String(error) }, { status: 500 })
  }
}
