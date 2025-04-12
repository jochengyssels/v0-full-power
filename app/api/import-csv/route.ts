import { NextResponse } from "next/server"
import { importAllCsvData } from "@/lib/import-csv-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { kitespotsUrl, kiteschoolsUrl } = body

    if (!kitespotsUrl || !kiteschoolsUrl) {
      return NextResponse.json({ error: "Missing required URLs for CSV files" }, { status: 400 })
    }

    const result = await importAllCsvData(kitespotsUrl, kiteschoolsUrl)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error importing CSV data:", error)
    return NextResponse.json({ error: "Failed to import CSV data", details: String(error) }, { status: 500 })
  }
}
