import { supabase } from "./supabase"

/**
 * Records a user interaction with a kite spot
 *
 * @param kitespotId The ID of the kite spot
 * @param interactionType The type of interaction ('search' or 'click')
 * @param userId Optional user ID for logged-in users
 */
export async function recordSpotInteraction(kitespotId: string, interactionType: "search" | "click", userId?: string) {
  try {
    console.log(`Recording ${interactionType} interaction for kitespot: ${kitespotId}`)

    // Call our API endpoint to record the interaction
    const response = await fetch("/api/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kitespotId,
        interactionType,
        userId,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error(`Failed to record interaction: ${result.error || response.status}`)
      return { success: false, error: result.error || "Unknown error" }
    }

    return result
  } catch (error) {
    console.error("Error recording spot interaction:", error)
    // Don't throw the error - we don't want to interrupt the user experience
    // if tracking fails
    return { success: false, error: String(error) }
  }
}

/**
 * Fetches the most popular kite spots based on interaction counts
 *
 * @param limit Number of popular spots to fetch (default: 3)
 */
export async function fetchPopularKiteSpots(limit = 3) {
  try {
    console.log("Fetching popular kite spots based on interactions...")

    // Query the popular_kitespots_view we created
    const { data, error } = await supabase.from("popular_kitespots_view").select("*").limit(limit)

    if (error) {
      console.error("Error fetching popular kite spots:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No popular kite spots found")

      // If no interactions have been recorded yet, fall back to a default query
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("kitespots")
        .select("*")
        .order("name")
        .limit(limit)

      if (fallbackError) {
        throw fallbackError
      }

      return fallbackData.map((spot) => ({
        id: spot.id,
        name: spot.name,
        country: spot.country,
        region: spot.location,
        city: "",
        lat: spot.latitude,
        lng: spot.longitude,
        color: "#3a7cc3",
        description: spot.description,
        difficulty: spot.difficulty,
        waterType: spot.water_type,
        interactionCount: 0,
      }))
    }

    console.log(`Successfully fetched ${data.length} popular kite spots`)

    // Transform the data to match the expected format in your frontend
    return data.map((spot) => ({
      id: spot.id,
      name: spot.name,
      country: spot.country,
      region: spot.location,
      city: "",
      lat: spot.latitude,
      lng: spot.longitude,
      color: "#3a7cc3",
      description: spot.description || "",
      difficulty: spot.difficulty || "intermediate",
      waterType: spot.water_type || "flat",
      interactionCount: spot.interaction_count,
    }))
  } catch (error) {
    console.error("Error fetching popular kite spots:", error)

    // Return fallback data to keep the app working
    console.warn("⚠️ Using fallback popular kite spots data due to API error")

    // Return hardcoded fallback data for the popular spots
    return [
      {
        id: "1",
        name: "Punta Trettu",
        country: "Italy",
        region: "Sardinia",
        city: "San Giovanni Suergiu",
        lat: 39.1833,
        lng: 8.3167,
        color: "#2a6cb3",
        difficulty: "beginner",
        waterType: "flat",
        interactionCount: 0,
      },
      {
        id: "2",
        name: "Tarifa",
        country: "Spain",
        region: "Andalusia",
        city: "Tarifa",
        lat: 36.0143,
        lng: -5.6044,
        color: "#4a94d3",
        difficulty: "intermediate",
        waterType: "choppy",
        interactionCount: 0,
      },
      {
        id: "3",
        name: "Dakhla",
        country: "Morocco",
        region: "Western Sahara",
        city: "Dakhla",
        lat: 23.7136,
        lng: -15.9355,
        color: "#3a7cc3",
        difficulty: "beginner",
        waterType: "flat",
        interactionCount: 0,
      },
    ]
  }
}
