import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { headers } from "next/headers"

// Helper function to validate UUID format
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { kitespotId, interactionType, userId } = body

    // Validate required fields
    if (!kitespotId || !interactionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get IP address from headers
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "unknown"

    // First check if the kitespot exists in the database
    let kitespotRecord = null

    // If it's a valid UUID, try to find it directly
    if (isValidUUID(kitespotId)) {
      const { data, error } = await supabase.from("kitespots").select("id").eq("id", kitespotId).limit(1)
      if (!error && data && data.length > 0) {
        kitespotRecord = data[0]
      }
    } else {
      // Try to find by name (case insensitive)
      const { data, error } = await supabase.from("kitespots").select("id").ilike("name", `%${kitespotId}%`).limit(1)
      if (!error && data && data.length > 0) {
        kitespotRecord = data[0]
      }
    }

    // If we couldn't find a matching kitespot, return an error
    if (!kitespotRecord) {
      console.log(`No matching kitespot found for: ${kitespotId}`)
      return NextResponse.json(
        { success: false, message: "Interaction not recorded: No matching kitespot found in database" },
        { status: 404 },
      )
    }

    // Record the interaction using the valid kitespot ID
    const { data, error } = await supabase
      .from("spot_interactions")
      .insert({
        kitespot_id: kitespotRecord.id,
        interaction_type: interactionType, // 'search' or 'click'
        user_id: userId || null,
        ip_address: ipAddress,
      })
      .select()

    if (error) {
      console.error("Error recording interaction:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Unexpected error recording interaction:", error)
    return NextResponse.json({ error: "Failed to record interaction", details: String(error) }, { status: 500 })
  }
}
