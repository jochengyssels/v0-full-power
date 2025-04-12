import { NextResponse } from "next/server"

export async function GET() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  try {
    console.log(`Checking connection to FastAPI backend at: ${API_BASE_URL}`)

    // Try to connect to the FastAPI server
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        message: "Successfully connected to FastAPI backend",
        status: response.status,
        data: data,
        apiBaseUrl: API_BASE_URL,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to connect to FastAPI backend: ${response.status} ${response.statusText}`,
          status: response.status,
          apiBaseUrl: API_BASE_URL,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error checking connection:", error)

    return NextResponse.json(
      {
        success: false,
        message: `Error connecting to FastAPI backend: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.stack : String(error),
        apiBaseUrl: API_BASE_URL,
      },
      { status: 500 },
    )
  }
}
