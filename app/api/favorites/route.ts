import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getFavoriteSpots, addFavoriteSpot, removeFavoriteSpot } from "@/lib/api-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const favorites = await getFavoriteSpots(userId)
    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error in favorites API route:", error)
    return NextResponse.json({ error: "Failed to fetch favorites", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, kitespotId } = body

    if (!userId || !kitespotId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const result = await addFavoriteSpot(userId, kitespotId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in favorites API route:", error)
    return NextResponse.json({ error: "Failed to add favorite", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const kitespotId = searchParams.get("kitespotId")

    if (!userId || !kitespotId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const result = await removeFavoriteSpot(userId, kitespotId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in favorites API route:", error)
    return NextResponse.json({ error: "Failed to remove favorite", details: String(error) }, { status: 500 })
  }
}
