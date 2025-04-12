import { type NextRequest, NextResponse } from "next/server"
import { findNearestKiteSpot } from "@/lib/api-service"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")

    if (!latParam || !lngParam) {
      return NextResponse.json({ error: "Missing latitude or longitude parameters" }, { status: 400 })
    }

    const lat = Number.parseFloat(latParam)
    const lng = Number.parseFloat(lngParam)

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
    }

    // Find the nearest kite spot
    const nearestSpot = await findNearestKiteSpot(lat, lng)

    return NextResponse.json(nearestSpot)
  } catch (error) {
    console.error("Error finding nearest kite spot:", error)

    return NextResponse.json({ error: "Failed to find nearest kite spot", details: String(error) }, { status: 500 })
  }
}
