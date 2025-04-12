import { type NextRequest, NextResponse } from "next/server"
import { fetchKiteSpotWeather, fetchOpenMeteoWeather } from "@/lib/api-service"

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

    try {
      // Get weather data from our service (which now uses Supabase)
      const weatherData = await fetchKiteSpotWeather(lat, lng)

      // If we got mock data from the fallback, add a flag to indicate this
      if (weatherData.isMockData) {
        console.log("Using mock data from fallback")
      }

      return NextResponse.json(weatherData)
    } catch (fastApiError) {
      console.error("Weather service error:", fastApiError)
      console.warn("⚠️ Weather service unavailable, trying direct Open-Meteo API...")

      // If our service fails, try direct Open-Meteo API
      try {
        const directData = await fetchOpenMeteoWeather(lat, lng)

        return NextResponse.json({
          ...directData,
          isDirectApi: true,
        })
      } catch (directApiError) {
        console.error("Direct API error:", directApiError)
        throw new Error("All weather data sources failed")
      }
    }
  } catch (error) {
    console.error("API route error:", error)

    // If all APIs fail, generate realistic mock data
    console.warn("⚠️ All weather APIs failed. Using mock data.")

    const mockData = {
      windSpeed: 10 + Math.random() * 15,
      windDirection: Math.floor(Math.random() * 360),
      windGust: 15 + Math.random() * 10,
      temperature: 20 + Math.random() * 10,
      waveHeight: 0.5 + Math.random() * 2,
      timestamp: new Date().toISOString(),
      isMockData: true,
    }

    return NextResponse.json(mockData)
  }
}
