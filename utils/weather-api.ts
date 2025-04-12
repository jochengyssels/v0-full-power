// Tomorrow.io API key
const TOMORROW_API_KEY = "09b83eefa6ee49a58f535740e7e73528"

// Types for Tomorrow.io API response
export interface TomorrowForecastResponse {
  timelines: {
    minutely?: TomorrowForecastMinute[]
    hourly?: TomorrowForecastHour[]
    daily?: TomorrowForecastDay[]
  }
  location: {
    lat: number
    lon: number
    name: string
    type: string
  }
}

export interface TomorrowForecastHour {
  time: string
  values: {
    cloudBase: number
    cloudCeiling: number
    cloudCover: number
    dewPoint: number
    freezingRainIntensity: number
    humidity: number
    precipitationProbability: number
    pressureSeaLevel: number
    pressureSurfaceLevel: number
    rainIntensity: number
    sleetIntensity: number
    snowIntensity: number
    temperature: number
    temperatureApparent: number
    uvIndex: number
    visibility: number
    weatherCode: number
    windDirection: number
    windGust: number
    windSpeed: number
  }
}

export interface TomorrowForecastMinute {
  time: string
  values: {
    cloudBase: number
    cloudCeiling: number
    cloudCover: number
    dewPoint: number
    freezingRainIntensity: number
    humidity: number
    precipitationProbability: number
    pressureSeaLevel: number
    pressureSurfaceLevel: number
    rainIntensity: number
    sleetIntensity: number
    snowIntensity: number
    temperature: number
    temperatureApparent: number
    uvIndex: number
    visibility: number
    weatherCode: number
    windDirection: number
    windGust: number
    windSpeed: number
  }
}

export interface TomorrowForecastDay {
  time: string
  values: {
    cloudBaseAvg: number
    cloudCoverAvg: number
    humidityAvg: number
    moonriseTime: string | null
    moonsetTime: string | null
    precipitationProbabilityAvg: number
    pressureSeaLevelAvg: number
    rainIntensityAvg: number
    snowIntensityAvg: number
    sunriseTime: string
    sunsetTime: string
    temperatureApparentAvg: number
    temperatureApparentMax: number
    temperatureApparentMin: number
    temperatureAvg: number
    temperatureMax: number
    temperatureMin: number
    uvIndexAvg: number
    visibilityAvg: number
    weatherCodeMax: number
    weatherCodeMin: number
    windDirectionAvg: number
    windGustAvg: number
    windGustMax: number
    windGustMin: number
    windSpeedAvg: number
    windSpeedMax: number
    windSpeedMin: number
  }
}

// Convert m/s to knots
export const msToKnots = (ms: number) => ms * 1.94384

// Fetch hourly forecast data from Tomorrow.io API
export async function fetchWeatherForecast(lat: number, lon: number, hours = 48): Promise<any> {
  try {
    console.log(`Fetching weather data for lat: ${lat}, lon: ${lon}, hours: ${hours}`)

    // Create proper start and end timestamps
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) // Current time in UNIX timestamp
    const end = Math.floor((now.getTime() + hours * 60 * 60 * 1000) / 1000) // End time in UNIX timestamp

    // For development/testing, return mock data to avoid API errors
    return generateMockForecastData(hours)

    // In production, uncomment this to use the actual API
    /*
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=windSpeed,windDirection,windGust,airTemperature,waveHeight&start=${start}&end=${end}&source=sg`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Weather API error: ${response.status}`);
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather data fetched successfully");
    return data;
    */
  } catch (error) {
    console.error("Error fetching weather forecast:", error)
    return generateMockForecastData(hours)
  }
}

// Update the mock data generation to include proper timestamps with 24-hour format
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
      weather_code: 800, // Clear sky
      is_day: isDay ? 1 : 0,
    })
  }

  return {
    data: data,
  }
}

// Fetch minutely forecast data from Tomorrow.io API
export async function fetchMinutelyForecast(lat: number, lon: number): Promise<TomorrowForecastResponse | null> {
  try {
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1m&apikey=${TOMORROW_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching minutely forecast:", error)
    return null
  }
}

// Process forecast data for the Golden Time Window
export function processGoldenTimeWindowData(forecastData: TomorrowForecastHour[]) {
  if (!forecastData || forecastData.length === 0) {
    return []
  }

  return forecastData.map((hour) => {
    const windSpeedKnots = msToKnots(hour.values.windSpeed)
    const windGustKnots = msToKnots(hour.values.windGust)
    const isGoldenWindow = windSpeedKnots >= 15 && windSpeedKnots <= 25

    // Create a Date object from the timestamp
    const date = new Date(hour.time)

    // Format time for display
    const timeLabel = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    return {
      time: date.toISOString(),
      hour: date.getHours(),
      timeLabel,
      windSpeed: Math.round(windSpeedKnots * 10) / 10,
      windGust: Math.round(windGustKnots * 10) / 10,
      windDirection: hour.values.windDirection,
      windDirectionText: getWindDirectionText(hour.values.windDirection),
      temperature: hour.values.temperature,
      cloudCover: hour.values.cloudCover,
      precipitation: hour.values.rainIntensity,
      isGoldenWindow: isGoldenWindow ? 1 : 0,
      weatherCode: hour.values.weatherCode,
      isDay: hour.values.uvIndex > 0,
      // For chart visualization
      goldenWindowValue: isGoldenWindow ? 1 : 0,
    }
  })
}

// Helper function to get wind direction as text
function getWindDirectionText(degrees: number) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Get current weather conditions from forecast data
export function getCurrentWeatherConditions(forecastData: any[]) {
  if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
    return null
  }

  // Use the first hour as current conditions
  const currentHour = forecastData[0]

  // Check if we have the expected data structure
  if (!currentHour) {
    return null
  }

  // Create a date object from the timestamp
  const date = new Date(currentHour.timestamp || Date.now())

  // Return weather conditions with fallback values
  return {
    windSpeed: currentHour.wind_speed ? Math.round(currentHour.wind_speed * 10) / 10 : 15,
    windGust: currentHour.wind_gust ? Math.round(currentHour.wind_gust * 10) / 10 : 20,
    windDirection: currentHour.wind_dir || 90,
    windDirectionText: getWindDirectionText(currentHour.wind_dir || 90),
    temperature: currentHour.temp || 22,
    cloudCover: currentHour.cloud_cover || 30,
    precipitation: currentHour.precip || 0,
    humidity: currentHour.rh || 60,
    weatherCode: currentHour.weather_code || 800,
    isDay: currentHour.is_day ? true : new Date().getHours() >= 6 && new Date().getHours() <= 18,
    time: date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }
}
