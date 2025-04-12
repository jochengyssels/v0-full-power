import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Fetch all kiteschools from Supabase
    const { data, error } = await supabase.from("kiteschools").select("*").order("company_name")

    if (error) {
      console.error("Error fetching kiteschools:", error)
      return NextResponse.json({ error: "Failed to fetch kiteschools" }, { status: 500 })
    }

    // Transform the data to include additional fields
    const transformedData = data.map((school) => ({
      ...school,
      rating: school.google_review_score ? Number.parseFloat(school.google_review_score) : null,
      // Extract price range min and max for filtering
      price_min: extractMinPrice(school.course_pricing),
      price_max: extractMaxPrice(school.course_pricing),
      // Generate a color if not present
      color: school.color || generateRandomColor(school.company_name),
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Unexpected error in kiteschools API route:", error)
    return NextResponse.json({ error: "Failed to fetch kiteschools", details: String(error) }, { status: 500 })
  }
}

// Helper function to extract minimum price from price range string
function extractMinPrice(priceRange: string | null): number | null {
  if (!priceRange) return null

  // Try to extract numbers from strings like "€80-350" or "$75-300"
  const matches = priceRange.match(/[0-9]+/g)
  if (!matches || matches.length === 0) return null

  return Number.parseInt(matches[0], 10)
}

// Helper function to extract maximum price from price range string
function extractMaxPrice(priceRange: string | null): number | null {
  if (!priceRange) return null

  // Try to extract numbers from strings like "€80-350" or "$75-300"
  const matches = priceRange.match(/[0-9]+/g)
  if (!matches || matches.length < 2) return null

  return Number.parseInt(matches[matches.length - 1], 10)
}

// Generate a consistent color based on school name
function generateRandomColor(name: string): string {
  // Simple hash function to generate a number from a string
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert to hex color
  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }

  return color
}
