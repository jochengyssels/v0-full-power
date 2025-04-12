import { supabase } from "./supabase"

// Initial kite spots data with additional fields
const initialKiteSpots = [
  {
    name: "Punta Trettu",
    description: "One of the best flat water spots in Europe, located in Sardinia.",
    latitude: 39.1833,
    longitude: 8.3167,
    country: "Italy",
    location: "Sardinia", // Changed from region to location based on schema
    difficulty: "beginner",
    water_type: "flat",
  },
  {
    name: "Dakhla",
    description: "Famous for its consistent wind and flat lagoon, perfect for freestyle.",
    latitude: 23.7136,
    longitude: -15.9355,
    country: "Morocco",
    location: "Western Sahara", // Changed from region to location based on schema
    difficulty: "beginner",
    water_type: "flat",
  },
  {
    name: "Tarifa",
    description: "The wind capital of Europe with strong Levante and Poniente winds.",
    latitude: 36.0143,
    longitude: -5.6044,
    country: "Spain",
    location: "Andalusia", // Changed from region to location based on schema
    difficulty: "intermediate",
    water_type: "choppy",
  },
  {
    name: "Jericoacoara",
    description: "Beautiful beach destination with consistent trade winds and warm water.",
    latitude: -2.7975,
    longitude: -40.5137,
    country: "Brazil",
    location: "Ceará", // Changed from region to location based on schema
    difficulty: "intermediate",
    water_type: "waves",
  },
  {
    name: "Cabarete",
    description: "Known for its afternoon thermal winds and vibrant kiteboarding community.",
    latitude: 19.758,
    longitude: -70.4193,
    country: "Dominican Republic",
    location: "Puerto Plata", // Changed from region to location based on schema
    difficulty: "intermediate",
    water_type: "waves",
  },
  {
    name: "Cape Town",
    description: "Home to Big Bay and Blouberg, with strong summer winds and stunning views.",
    latitude: -33.9249,
    longitude: 18.4241,
    country: "South Africa",
    location: "Western Cape", // Changed from region to location based on schema
    difficulty: "advanced",
    water_type: "waves",
  },
]

// Initial kiteschools data
const initialKiteSchools = [
  {
    company_name: "ProKite Alby Rondina",
    location: "Punta Trettu, Sardinia",
    country: "Italy",
    google_review_score: "4.9",
    owner_name: "Alby Rondina",
    website_url: "https://www.prokitealbyrondina.com",
    course_pricing: "€80-350",
    logo_url: "/images/prokite-sardinia-logo.png",
  },
  {
    company_name: "KiteVillage Sardinia",
    location: "Porto Botte, Sardinia",
    country: "Italy",
    google_review_score: "4.8",
    owner_name: "Marco Pescetto",
    website_url: "https://www.kitevillagesardinia.com",
    course_pricing: "€75-300",
    logo_url: "/images/kitevillage-sardinia-logo.png",
  },
  {
    company_name: "Tarifa Max",
    location: "Tarifa, Spain",
    country: "Spain",
    google_review_score: "4.7",
    owner_name: "Max Mart",
    website_url: "https://www.tarifamax.com",
    course_pricing: "€70-280",
    logo_url: null,
  },
  {
    company_name: "Dakhla Attitude",
    location: "Dakhla, Morocco",
    country: "Morocco",
    google_review_score: "4.9",
    owner_name: "Rachid El Fadili",
    website_url: "https://www.dakhla-attitude.com",
    course_pricing: "€65-250",
    logo_url: null,
  },
  {
    company_name: "Kite Beach Hotel",
    location: "Cabarete, Dominican Republic",
    country: "Dominican Republic",
    google_review_score: "4.6",
    owner_name: "Laurel Eastman",
    website_url: "https://www.kitebeachhotel.com",
    course_pricing: "$80-350",
    logo_url: null,
  },
]

export async function seedKiteSpots() {
  try {
    console.log("Checking if kite spots need to be seeded...")

    // Check if we already have kite spots in the database
    const { data: existingSpots, error: checkError } = await supabase
      .from("kitespots") // Changed from kite_spots to kitespots based on schema
      .select("id")
      .limit(1)

    if (checkError) {
      console.error("Error checking existing kite spots:", checkError)
      return { success: false, error: checkError.message }
    }

    // If we already have spots, don't seed
    if (existingSpots && existingSpots.length > 0) {
      console.log("Kite spots already exist, skipping seed")
      return { success: true, message: "Kite spots already exist" }
    }

    // Insert the initial kite spots
    console.log("Seeding kite spots...")
    const { data, error } = await supabase
      .from("kitespots") // Changed from kite_spots to kitespots based on schema
      .insert(initialKiteSpots)
      .select()

    if (error) {
      console.error("Error seeding kite spots:", error)
      return { success: false, error: error.message }
    }

    console.log(`Successfully seeded ${data.length} kite spots`)
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error during seeding:", error)
    return { success: false, error: String(error) }
  }
}

export async function seedKiteSchools() {
  try {
    console.log("Checking if kite schools need to be seeded...")

    // Check if we already have kite schools in the database
    const { data: existingSchools, error: checkError } = await supabase.from("kiteschools").select("id").limit(1)

    if (checkError) {
      console.error("Error checking existing kite schools:", checkError)
      return { success: false, error: checkError.message }
    }

    // If we already have schools, don't seed
    if (existingSchools && existingSchools.length > 0) {
      console.log("Kite schools already exist, skipping seed")
      return { success: true, message: "Kite schools already exist" }
    }

    // Insert the initial kite schools
    console.log("Seeding kite schools...")
    const { data, error } = await supabase.from("kiteschools").insert(initialKiteSchools).select()

    if (error) {
      console.error("Error seeding kite schools:", error)
      return { success: false, error: error.message }
    }

    console.log(`Successfully seeded ${data.length} kite schools`)
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error during seeding:", error)
    return { success: false, error: String(error) }
  }
}

export async function seedAllData() {
  const kiteSpotResult = await seedKiteSpots()
  const kiteSchoolResult = await seedKiteSchools()

  return {
    kiteSpots: kiteSpotResult,
    kiteSchools: kiteSchoolResult,
  }
}
