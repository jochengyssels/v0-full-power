import { supabase } from "./supabase"
import Papa from "papaparse"

// Function to fetch and parse CSV data
async function fetchAndParseCsv(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()

    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data)
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    throw error
  }
}

// Function to import kitespots data
export async function importKitespotsData(csvUrl: string) {
  try {
    console.log("Fetching kitespots CSV data...")
    const spotsData = await fetchAndParseCsv(csvUrl)
    console.log(`Parsed ${spotsData.length} kitespot records`)

    // Transform data to match our database schema
    const formattedSpots = spotsData.map((spot) => ({
      name: spot.name,
      description: `Kitespot in ${spot.location}, ${spot.country}`,
      latitude: Number.parseFloat(spot.latitude),
      longitude: Number.parseFloat(spot.longitude),
      country: spot.country,
      region: spot.location,
      city: "",
      difficulty: spot.difficulty || "Intermediate",
      water_type: spot.water_type || "Flat",
      best_wind_direction: "",
      best_season: "",
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    }))

    // Check if we already have data in the table
    const { count, error: countError } = await supabase.from("kite_spots").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking existing kite spots:", countError)
      return { success: false, error: countError.message }
    }

    if (count && count > 0) {
      console.log(`Found ${count} existing kite spots. Skipping import.`)
      return {
        success: true,
        message: `Skipped import. ${count} kite spots already exist in the database.`,
        existingCount: count,
      }
    }

    // Insert data in batches to avoid hitting limits
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < formattedSpots.length; i += batchSize) {
      const batch = formattedSpots.slice(i, i + batchSize)
      const { data, error } = await supabase.from("kite_spots").insert(batch).select()

      if (error) {
        console.error(`Error inserting batch ${i}-${i + batch.length}:`, error)
        return { success: false, error: error.message, insertedCount }
      }

      insertedCount += data.length
      console.log(`Inserted batch ${i}-${i + batch.length}: ${data.length} records`)
    }

    return {
      success: true,
      message: `Successfully imported ${insertedCount} kite spots`,
      insertedCount,
    }
  } catch (error) {
    console.error("Error importing kitespots data:", error)
    return { success: false, error: String(error) }
  }
}

// Function to import kiteschools data
export async function importKiteschoolsData(csvUrl: string) {
  try {
    console.log("Fetching kiteschools CSV data...")
    const schoolsData = await fetchAndParseCsv(csvUrl)
    console.log(`Parsed ${schoolsData.length} kiteschool records`)

    // Transform data to match our database schema
    const formattedSchools = schoolsData.map((school) => ({
      company_name: school["Company Name"],
      location: school["Location (City/Town)"],
      country: school["Country"],
      google_review_score: school["Google Review Score"],
      owner_name: school["Owner's Name"],
      website_url: school["Website URL"],
      course_pricing: school["Course Pricing"],
      logo_url: null,
    }))

    // Check if we already have data in the table
    const { count, error: countError } = await supabase.from("kiteschools").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking existing kiteschools:", countError)
      return { success: false, error: countError.message }
    }

    if (count && count > 0) {
      console.log(`Found ${count} existing kiteschools. Skipping import.`)
      return {
        success: true,
        message: `Skipped import. ${count} kiteschools already exist in the database.`,
        existingCount: count,
      }
    }

    // Insert data in batches to avoid hitting limits
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < formattedSchools.length; i += batchSize) {
      const batch = formattedSchools.slice(i, i + batchSize)
      const { data, error } = await supabase.from("kiteschools").insert(batch).select()

      if (error) {
        console.error(`Error inserting batch ${i}-${i + batch.length}:`, error)
        return { success: false, error: error.message, insertedCount }
      }

      insertedCount += data.length
      console.log(`Inserted batch ${i}-${i + batch.length}: ${data.length} records`)
    }

    return {
      success: true,
      message: `Successfully imported ${insertedCount} kiteschools`,
      insertedCount,
    }
  } catch (error) {
    console.error("Error importing kiteschools data:", error)
    return { success: false, error: String(error) }
  }
}

// Function to import all CSV data
export async function importAllCsvData(kitespotsUrl: string, kiteschoolsUrl: string) {
  const spotsResult = await importKitespotsData(kitespotsUrl)
  const schoolsResult = await importKiteschoolsData(kiteschoolsUrl)

  return {
    kiteSpots: spotsResult,
    kiteSchools: schoolsResult,
  }
}
