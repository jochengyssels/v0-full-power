/**
 * API Service for connecting to Supabase and external weather APIs
 */
import { supabase } from "./supabase"
import { seedKiteSpots, seedKiteSchools } from "./seed-data"

// Base URL for the Open-Meteo API
const OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast"

/**
 * Fetches all kite spots from Supabase
 */
export async function fetchKiteSpots() {
  try {
    console.log("Fetching kite spots from Supabase...")

    // Ensure we have seed data
    await seedKiteSpots()

    // Fetch kite spots from Supabase - using "kitespots" table name from schema
    const { data, error } = await supabase.from("kitespots").select("*").order("name")

    if (error) {
      console.error("Error fetching kite spots from Supabase:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No kite spots found in Supabase")
      throw new Error("No kite spots found")
    }

    console.log(`Successfully fetched ${data.length} kite spots from Supabase`)

    // Transform the data to match the expected format in your frontend
    return data.map((spot) => ({
      id: spot.id,
      name: spot.name,
      country: spot.country,
      region: spot.location, // Using location field as region based on schema
      city: "", // No city field in schema
      lat: spot.latitude,
      lng: spot.longitude,
      color: "#3a7cc3", // Default color since it's not in schema
      description: spot.description,
      difficulty: spot.difficulty,
      waterType: spot.water_type,
      bestWindDirection: "", // Not in schema
      bestSeason: "", // Not in schema
    }))
  } catch (error) {
    console.error("Error fetching kite spots:", error)

    // For now, we'll still return fallback data to keep the app working
    console.warn("⚠️ Using fallback kite spots data due to API error")

    // Return hardcoded fallback data
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
        bestWindDirection: "NW, W",
        bestSeason: "May to September",
      },
      {
        id: "2",
        name: "Dakhla",
        country: "Morocco",
        region: "Western Sahara",
        city: "Dakhla",
        lat: 23.7136,
        lng: -15.9355,
        color: "#3a7cc3",
        difficulty: "beginner",
        waterType: "flat",
        bestWindDirection: "N, NE",
        bestSeason: "Year-round, best from April to September",
      },
      {
        id: "3",
        name: "Tarifa",
        country: "Spain",
        region: "Andalusia",
        city: "Tarifa",
        lat: 36.0143,
        lng: -5.6044,
        color: "#4a94d3",
        difficulty: "intermediate",
        waterType: "choppy",
        bestWindDirection: "E, W",
        bestSeason: "April to October",
      },
    ]
  }
}

/**
 * Fetches popular kite spots from Supabase
 */
export async function fetchPopularKiteSpots() {
  try {
    console.log("Fetching popular kite spots from Supabase...")

    // Fetch popular kite spots with their details from the kitespots table
    const { data, error } = await supabase
      .from("popular_kitespots")
      .select(`
        id,
        display_order,
        kitespot_id,
        kitespots (
          id,
          name,
          description,
          latitude,
          longitude,
          country,
          location,
          difficulty,
          water_type
        )
      `)
      .order("display_order")

    if (error) {
      console.error("Error fetching popular kite spots from Supabase:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No popular kite spots found in Supabase")
      throw new Error("No popular kite spots found")
    }

    console.log(`Successfully fetched ${data.length} popular kite spots from Supabase`)

    // Transform the data to match the expected format in your frontend
    return data.map((item) => ({
      id: item.kitespots.id,
      name: item.kitespots.name,
      country: item.kitespots.country,
      region: item.kitespots.location, // Using location field as region
      city: "", // No city field in schema
      lat: item.kitespots.latitude,
      lng: item.kitespots.longitude,
      color: "#3a7cc3", // Default color
      description: item.kitespots.description,
      difficulty: item.kitespots.difficulty,
      waterType: item.kitespots.water_type,
      displayOrder: item.display_order,
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
        displayOrder: 1,
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
        displayOrder: 2,
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
        displayOrder: 3,
      },
      {
        id: "4",
        name: "Cape Town",
        country: "South Africa",
        region: "Western Cape",
        city: "Cape Town",
        lat: -33.9249,
        lng: 18.4241,
        color: "#7adcff",
        difficulty: "advanced",
        waterType: "waves",
        displayOrder: 4,
      },
    ]
  }
}

/**
 * Finds the nearest kite spot to the given coordinates
 *
 * @param lat Latitude
 * @param lng Longitude
 */
export async function findNearestKiteSpot(lat: number, lng: number) {
  try {
    console.log(`Finding nearest kite spot to coordinates: ${lat}, ${lng}`)

    // Fetch all kite spots - using "kitespots" table name from schema
    const { data, error } = await supabase.from("kitespots").select("*")

    if (error) {
      console.error("Error fetching kite spots for nearest calculation:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No kite spots found for nearest calculation")
      throw new Error("No kite spots found")
    }

    // Calculate distance to each spot using Haversine formula
    const spotsWithDistance = data.map((spot) => {
      const distance = calculateHaversineDistance(lat, lng, spot.latitude, spot.longitude)
      return { ...spot, distance }
    })

    // Sort by distance and get the nearest spot
    spotsWithDistance.sort((a, b) => a.distance - b.distance)
    const nearestSpot = spotsWithDistance[0]

    console.log(`Nearest kite spot is ${nearestSpot.name} at ${nearestSpot.distance.toFixed(2)} km`)
    return nearestSpot
  } catch (error) {
    console.error("Error finding nearest kite spot:", error)

    // Return a fallback spot instead of throwing the error
    console.warn("⚠️ Using fallback kite spot due to error")
    return {
      id: "fallback-id",
      name: "Fallback Location",
      description: "Automatically generated fallback location",
      latitude: lat,
      longitude: lng,
      country: "Unknown",
      location: "Unknown",
      difficulty: "intermediate",
      water_type: "unknown",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      distance: 0,
    }
  }
}

/**
 * Fetches weather data for a specific location
 *
 * @param lat Latitude
 * @param lng Longitude
 */
export async function fetchKiteSpotWeather(lat: number, lng: number) {
  try {
    console.log(`Fetching weather data for coordinates: ${lat}, ${lng}`)

    // First try to find the closest kite spot
    const nearestSpot = await findNearestKiteSpot(lat, lng)

    // Check if we have recent weather data in the database
    const { data: existingWeather, error: weatherError } = await supabase
      .from("weather_data")
      .select("*")
      .eq("spot_id", nearestSpot.id)
      .order("timestamp", { ascending: false })
      .limit(1)

    // If we have recent data (less than 1 hour old), use it
    if (!weatherError && existingWeather && existingWeather.length > 0) {
      const weatherData = existingWeather[0]
      const dataAge = new Date().getTime() - new Date(weatherData.timestamp).getTime()

      // If data is less than 1 hour old, use it
      if (dataAge < 60 * 60 * 1000) {
        console.log(`Using recent weather data for ${nearestSpot.name} from database`)
        return {
          windSpeed: weatherData.wind_speed_10m,
          windDirection: weatherData.wind_direction_10m,
          windGust: weatherData.wind_gust || weatherData.wind_speed_10m * 1.3, // Use wind_gust if available
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          precipitation: weatherData.precipitation,
          cloudCover: weatherData.cloud_cover,
          visibility: weatherData.visibility,
          timestamp: weatherData.timestamp,
          spotId: nearestSpot.id,
          spotName: nearestSpot.name,
          isMockData: weatherData.is_mock,
          weatherCode: weatherData.weather_code,
          isDay: weatherData.is_day,
        }
      }
    }

    // If we don't have recent data, fetch from Open-Meteo API
    console.log(`Fetching fresh weather data for ${nearestSpot.name} from Open-Meteo`)
    const weatherData = await fetchOpenMeteoWeather(nearestSpot.latitude, nearestSpot.longitude)

    // Store the weather data in the database
    try {
      const { error: insertError } = await supabase.from("weather_data").insert({
        spot_id: nearestSpot.id,
        timestamp: new Date().toISOString(),
        temperature: weatherData.temperature,
        humidity: weatherData.humidity || 0,
        precipitation: weatherData.precipitation || 0,
        wind_speed_10m: weatherData.windSpeed,
        wind_direction_10m: weatherData.windDirection,
        cloud_cover: weatherData.cloudCover || 0,
        visibility: weatherData.visibility || 0,
        wind_gust: weatherData.windGust || weatherData.windSpeed * 1.3,
        weather_code: weatherData.weatherCode || 0,
        is_day: weatherData.isDay || true,
        is_mock: weatherData.isMockData || false,
      })

      if (insertError) {
        console.error("Error storing weather data in database:", insertError)
      } else {
        console.log("Successfully stored weather data in database")
      }
    } catch (storeError) {
      // Log the error but don't throw it to allow the function to continue
      console.error("Failed to store weather data:", storeError)
    }

    return {
      ...weatherData,
      spotId: nearestSpot.id,
      spotName: nearestSpot.name,
    }
  } catch (error) {
    console.error("Error fetching kite spot weather:", error)

    // Generate mock data as fallback
    console.warn("⚠️ Using mock weather data due to API error")

    // Return mock data instead of throwing the error
    return {
      windSpeed: 10 + Math.random() * 15,
      windDirection: Math.floor(Math.random() * 360),
      windGust: 15 + Math.random() * 10,
      temperature: 20 + Math.random() * 10,
      humidity: 60 + Math.random() * 20,
      precipitation: Math.random() * 2,
      cloudCover: Math.random() * 100,
      visibility: 10 + Math.random() * 10,
      timestamp: new Date().toISOString(),
      spotId: "mock-id",
      spotName: "Mock Location",
      isMockData: true,
      weatherCode: 800,
      isDay: true,
    }
  }
}

/**
 * Fetches weather data directly from Open-Meteo API
 *
 * @param lat Latitude
 * @param lng Longitude
 */
export async function fetchOpenMeteoWeather(lat: number, lng: number) {
  try {
    console.log(`Fetching direct weather data from Open-Meteo for: ${lat}, ${lng}`)

    const url = `${OPEN_METEO_API_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weathercode,cloud_cover,visibility,windspeed_10m,winddirection_10m,is_day`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Received direct weather data from Open-Meteo:`, data)

    if (!data.current) {
      throw new Error("Invalid weather data format from Open-Meteo")
    }

    // Transform to expected format
    return {
      windSpeed: data.current.windspeed_10m,
      windDirection: data.current.winddirection_10m,
      windGust: data.current.windspeed_10m * 1.3, // Estimate
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      cloudCover: data.current.cloud_cover,
      visibility: data.current.visibility,
      weatherCode: data.current.weathercode,
      timestamp: data.current.time,
      isDay: data.current.is_day === 1,
      isMockData: false,
      isDirectApi: true,
    }
  } catch (error) {
    console.error("Error fetching direct weather data:", error)
    throw error
  }
}

/**
 * Fetches hourly forecast data from Open-Meteo API
 *
 * @param lat Latitude
 * @param lng Longitude
 * @param hours Number of hours to forecast
 */
export async function fetchWeatherForecast(lat: number, lng: number, hours = 48) {
  try {
    console.log(`Fetching weather forecast for: ${lat}, ${lng}, hours: ${hours}`)

    // Try to find the nearest kite spot
    let spotId = null
    try {
      const nearestSpot = await findNearestKiteSpot(lat, lng)
      spotId = nearestSpot.id

      // Check if we have recent forecast data in the database
      const { data: existingForecast, error: forecastError } = await supabase
        .from("forecast_data")
        .select("*")
        .eq("spot_id", spotId) // Using spot_id from schema
        .gte("forecast_time", new Date().toISOString())
        .order("forecast_time", { ascending: true })

      // If we have recent forecast data, use it
      if (!forecastError && existingForecast && existingForecast.length > 0) {
        console.log(`Using existing forecast data for ${nearestSpot.name} from database`)

        // Transform the data to match the expected format
        const forecastData = existingForecast.map((item) => ({
          timestamp: item.forecast_time,
          wind_speed: item.wind_speed,
          wind_gust: item.wind_gust,
          wind_dir: item.wind_direction,
          temp: item.temperature,
          wave_height: item.wave_height,
          weather_code: item.weather_code,
          is_day: new Date(item.forecast_time).getHours() >= 6 && new Date(item.forecast_time).getHours() <= 18 ? 1 : 0,
        }))

        return { data: forecastData }
      }
    } catch (spotError) {
      console.error("Error finding nearest spot for forecast:", spotError)
      // Continue with direct API call
    }

    // Fetch from Open-Meteo API
    const url = `${OPEN_METEO_API_URL}?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&forecast_hours=${hours}&current_weather=true`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
      throw new Error("Invalid forecast data format from Open-Meteo")
    }

    // Transform the data to match the expected format
    const forecastData = data.hourly.time.map((time: string, index: number) => {
      const hour = new Date(time)
      const isDay = hour.getHours() >= 6 && hour.getHours() <= 18

      return {
        timestamp: time,
        wind_speed: data.hourly.windspeed_10m[index],
        wind_gust: data.hourly.windspeed_10m[index] * 1.3, // Estimate
        wind_dir: data.hourly.winddirection_10m[index],
        temp: data.hourly.temperature_2m[index],
        wave_height: 0, // Not available from this API
        weather_code: data.hourly.weathercode[index],
        is_day: isDay ? 1 : 0,
      }
    })

    // If we have a spot ID, store the forecast data in the database
    if (spotId) {
      // Prepare the data for insertion
      const forecastInsertData = forecastData.map((item) => ({
        spot_id: spotId, // Using spot_id from schema
        forecast_time: item.timestamp,
        wind_speed: item.wind_speed,
        wind_direction: item.wind_dir,
        wind_gust: item.wind_gust,
        temperature: item.temp,
        wave_height: item.wave_height || 0,
        weather_code: item.weather_code,
        is_mock: false,
      }))

      // Insert in batches to avoid hitting limits
      const batchSize = 50
      for (let i = 0; i < forecastInsertData.length; i += batchSize) {
        const batch = forecastInsertData.slice(i, i + batchSize)
        const { error: insertError } = await supabase.from("forecast_data").insert(batch)

        if (insertError) {
          console.error(`Error storing forecast batch ${i}-${i + batchSize} in database:`, insertError)
        }
      }
    }

    return { data: forecastData }
  } catch (error) {
    console.error("Error fetching weather forecast:", error)

    // Generate mock data as fallback
    return { data: generateMockForecastData(hours) }
  }
}

/**
 * Fetches all kite schools from Supabase
 */
export async function fetchKiteSchools() {
  try {
    console.log("Fetching kite schools from Supabase...")

    // Ensure we have seed data
    await seedKiteSchools()

    // Fetch kite schools from Supabase
    const { data, error } = await supabase.from("kiteschools").select("*").order("company_name")

    if (error) {
      console.error("Error fetching kite schools from Supabase:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No kite schools found in Supabase")
      throw new Error("No kite schools found")
    }

    console.log(`Successfully fetched ${data.length} kite schools from Supabase`)
    return data
  } catch (error) {
    console.error("Error fetching kite schools:", error)

    // Return fallback data
    return [
      {
        id: "1",
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
        id: "2",
        company_name: "KiteVillage Sardinia",
        location: "Porto Botte, Sardinia",
        country: "Italy",
        google_review_score: "4.8",
        owner_name: "Marco Pescetto",
        website_url: "https://www.kitevillagesardinia.com",
        course_pricing: "€75-300",
        logo_url: "/images/kitevillage-sardinia-logo.png",
      },
    ]
  }
}

/**
 * Adds a kite spot to a user's favorites
 *
 * @param userId User ID
 * @param kitespotId Kite spot ID
 */
export async function addFavoriteSpot(userId: string, kitespotId: string) {
  try {
    const { data, error } = await supabase
      .from("favorite_spots")
      .insert({
        user_id: userId,
        kitespot_id: kitespotId,
      })
      .select()

    if (error) {
      console.error("Error adding favorite spot:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding favorite spot:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Removes a kite spot from a user's favorites
 *
 * @param userId User ID
 * @param kitespotId Kite spot ID
 */
export async function removeFavoriteSpot(userId: string, kitespotId: string) {
  try {
    const { error } = await supabase.from("favorite_spots").delete().match({ user_id: userId, kitespot_id: kitespotId })

    if (error) {
      console.error("Error removing favorite spot:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error removing favorite spot:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Gets a user's favorite kite spots
 *
 * @param userId User ID
 */
export async function getFavoriteSpots(userId: string) {
  try {
    const { data, error } = await supabase
      .from("favorite_spots")
      .select(`
        id,
        kitespot_id,
        kitespots (*)
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error getting favorite spots:", error)
      throw error
    }

    return data.map((item) => ({
      id: item.id,
      kitespotId: item.kitespot_id,
      kitespot: item.kitespots,
    }))
  } catch (error) {
    console.error("Error getting favorite spots:", error)
    return []
  }
}

/**
 * Adds a kite session for a user
 *
 * @param userId User ID
 * @param sessionData Session data
 */
export async function addKiteSession(
  userId: string,
  sessionData: {
    kitespotId: string
    date: string
    durationMinutes: number
    kiteSize: number
    windSpeed: number
    notes?: string
  },
) {
  try {
    const { data, error } = await supabase
      .from("kite_sessions")
      .insert({
        user_id: userId,
        kitespot_id: sessionData.kitespotId,
        date: sessionData.date,
        duration_minutes: sessionData.durationMinutes,
        kite_size: sessionData.kiteSize,
        wind_speed: sessionData.windSpeed,
        notes: sessionData.notes,
      })
      .select()

    if (error) {
      console.error("Error adding kite session:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding kite session:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Gets a user's kite sessions
 *
 * @param userId User ID
 */
export async function getKiteSessions(userId: string) {
  try {
    const { data, error } = await supabase
      .from("kite_sessions")
      .select(`
        id,
        date,
        duration_minutes,
        kite_size,
        wind_speed,
        notes,
        kitespots (*)
      `)
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error getting kite sessions:", error)
      throw error
    }

    return data.map((session) => ({
      id: session.id,
      date: session.date,
      durationMinutes: session.duration_minutes,
      kiteSize: session.kite_size,
      windSpeed: session.wind_speed,
      notes: session.notes,
      kitespot: session.kitespots,
    }))
  } catch (error) {
    console.error("Error getting kite sessions:", error)
    return []
  }
}

/**
 * Generate mock forecast data
 */
function generateMockForecastData(hours: number) {
  const data = []
  const now = new Date()

  for (let i = 0; i < hours; i++) {
    const date = new Date(now.getTime() + i * 60 * 60 * 1000)

    // Generate realistic wind patterns
    const hourOfDay = date.getHours()
    // Make wind stronger during day, weaker at night
    const timeMultiplier = hourOfDay >= 10 && hourOfDay <= 18 ? 1.2 : 0.8
    const baseWindSpeed = (10 + Math.sin(i / 6) * 8) * timeMultiplier
    const windSpeed = Math.max(0, baseWindSpeed + (Math.random() * 4 - 2))
    const windGust = windSpeed + 2 + Math.random() * 5
    const temp = Math.floor(Math.random() * 15) + 15
    const isDay = date.getHours() >= 6 && date.getHours() <= 18

    data.push({
      timestamp: date.toISOString(),
      wind_speed: Math.round(windSpeed * 10) / 10,
      wind_gust: Math.round(windGust * 10) / 10,
      wind_dir: Math.floor(Math.random() * 360),
      temp: temp,
      wave_height: Math.random() * 2,
      weather_code: 800, // Clear sky
      is_day: isDay ? 1 : 0,
    })
  }

  return data
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km

  return distance
}
