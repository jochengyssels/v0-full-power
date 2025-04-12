import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Fetching kite spots from Supabase...")

    // Fetch kite spots from Supabase
    const { data, error } = await supabase.from("kitespots").select("*").order("name")

    if (error) {
      console.error("Error fetching kite spots from Supabase:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No kite spots found in Supabase")
      throw new Error("No kite spots found")
    }

    console.log(`Successfully fetched ${data.length} kite spots from Supabase`)

    // Get unique countries, difficulties, and water types for filters
    const countries = [...new Set(data.map((spot) => spot.country))].filter(Boolean).sort()
    const difficulties = [...new Set(data.map((spot) => spot.difficulty))].filter(Boolean).sort()
    const waterTypes = [...new Set(data.map((spot) => spot.water_type))].filter(Boolean).sort()

    return NextResponse.json({
      kitespots: data,
      filters: {
        countries,
        difficulties,
        waterTypes,
      },
    })
  } catch (error) {
    console.error("Error fetching kite spots:", error)

    // Generate mock data as fallback
    const mockData = [
      {
        id: "1",
        name: "Tarifa",
        country: "Spain",
        location: "Andalusia",
        latitude: 36.0143,
        longitude: -5.6044,
        difficulty: "intermediate",
        water_type: "choppy",
      },
      {
        id: "2",
        name: "Dakhla",
        country: "Morocco",
        location: "Western Sahara",
        latitude: 23.7136,
        longitude: -15.9355,
        difficulty: "beginner",
        water_type: "flat",
      },
      {
        id: "3",
        name: "Cabarete",
        country: "Dominican Republic",
        location: "Puerto Plata",
        latitude: 19.758,
        longitude: -70.4193,
        difficulty: "intermediate",
        water_type: "waves",
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
      },
    ]

    return NextResponse.json({
      kitespots: mockData,
      filters: {
        countries: ["Spain", "Morocco", "Dominican Republic", "South Africa", "Philippines", "Germany"],
        difficulties: ["beginner", "intermediate", "advanced"],
        waterTypes: ["flat", "choppy", "waves"],
      },
    })
  }
}
