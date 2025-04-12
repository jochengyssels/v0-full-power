import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getKiteSessions, addKiteSession } from "@/lib/api-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const sessions = await getKiteSessions(userId)
    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error in sessions API route:", error)
    return NextResponse.json({ error: "Failed to fetch sessions", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, kitespotId, date, durationMinutes, kiteSize, windSpeed, notes } = body

    if (!userId || !kitespotId || !date || !durationMinutes || !kiteSize || !windSpeed) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const result = await addKiteSession(userId, {
      kitespotId,
      date,
      durationMinutes,
      kiteSize,
      windSpeed,
      notes,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in sessions API route:", error)
    return NextResponse.json({ error: "Failed to add session", details: String(error) }, { status: 500 })
  }
}
