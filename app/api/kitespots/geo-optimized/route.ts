import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export const runtime = "edge" // Use edge runtime for better performance

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Use PostGIS for efficient geospatial query
    const { data, error } = await supabase.rpc("get_kitespots_with_geospatial_data")

    if (error) {
      console.error("Error in geo-optimized query:", error)
      throw error
    }

    // Add cache headers for better performance
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Error fetching optimized kitespots:", error)
    return NextResponse.json({ error: "Failed to fetch kitespots" }, { status: 500 })
  }
}
