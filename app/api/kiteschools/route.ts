import { NextResponse } from "next/server"
import { fetchKiteSchools } from "@/lib/api-service"

export async function GET() {
  try {
    // Fetch kite schools from Supabase
    const kiteSchools = await fetchKiteSchools()
    return NextResponse.json(kiteSchools)
  } catch (error) {
    console.error("Unexpected error in kiteschools API route:", error)
    return NextResponse.json({ error: "Failed to fetch kite schools", details: String(error) }, { status: 500 })
  }
}
