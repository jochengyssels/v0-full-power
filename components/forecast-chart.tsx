"use client"

import { useEffect, useState } from "react"
import { Sun, Cloud, CloudRain, CloudLightning, Moon, CloudMoon, Snowflake } from "lucide-react"
import Image from "next/image"

// Mock forecast data - in a real app, this would come from an API
const mockForecastData = {
  "Tarifa, Spain": {
    location: "Tarifa Beach",
    hours: [
      { time: 8, icon: "cloudSun", temp: 14, windSpeed: 10, windDirection: "→" },
      { time: 11, icon: "sun", temp: 18, windSpeed: 10, windDirection: "→" },
      { time: 14, icon: "sun", temp: 20, windSpeed: 8, windDirection: "→" },
      { time: 17, icon: "sun", temp: 20, windSpeed: 8, windDirection: "→" },
      { time: 20, icon: "moon", temp: 16, windSpeed: 9, windDirection: "↘" },
      { time: 23, icon: "moon", temp: 15, windSpeed: 8, windDirection: "↘" },
      { time: 2, icon: "moon", temp: 14, windSpeed: 7, windDirection: "↘" },
      { time: 5, icon: "moon", temp: 14, windSpeed: 6, windDirection: "↘" },
      { time: 8, icon: "cloudSun", temp: 14, windSpeed: 6, windDirection: "↓" },
      { time: 11, icon: "sun", temp: 18, windSpeed: 6, windDirection: "↓" },
      { time: 14, icon: "sun", temp: 20, windSpeed: 6, windDirection: "↓" },
      { time: 17, icon: "sun", temp: 19, windSpeed: 5, windDirection: "↓" },
      { time: 20, icon: "cloudMoon", temp: 16, windSpeed: 6, windDirection: "↙" },
      { time: 23, icon: "cloudMoon", temp: 15, windSpeed: 6, windDirection: "↙" },
      { time: 2, icon: "cloudMoon", temp: 15, windSpeed: 7, windDirection: "↙" },
      { time: 5, icon: "cloudMoon", temp: 15, windSpeed: 7, windDirection: "↙" },
    ],
  },
  "Maui, Hawaii": {
    location: "Kite Beach, Maui",
    hours: [
      { time: 8, icon: "sun", temp: 24, windSpeed: 12, windDirection: "→" },
      { time: 11, icon: "sun", temp: 26, windSpeed: 15, windDirection: "→" },
      { time: 14, icon: "sun", temp: 28, windSpeed: 18, windDirection: "→" },
      { time: 17, icon: "sun", temp: 27, windSpeed: 16, windDirection: "→" },
      { time: 20, icon: "moon", temp: 24, windSpeed: 12, windDirection: "→" },
      { time: 23, icon: "moon", temp: 23, windSpeed: 10, windDirection: "→" },
      { time: 2, icon: "moon", temp: 22, windSpeed: 8, windDirection: "→" },
      { time: 5, icon: "moon", temp: 22, windSpeed: 7, windDirection: "→" },
      { time: 8, icon: "sun", temp: 24, windSpeed: 10, windDirection: "→" },
      { time: 11, icon: "sun", temp: 26, windSpeed: 14, windDirection: "→" },
      { time: 14, icon: "sun", temp: 28, windSpeed: 17, windDirection: "→" },
      { time: 17, icon: "sun", temp: 27, windSpeed: 15, windDirection: "→" },
      { time: 20, icon: "moon", temp: 24, windSpeed: 12, windDirection: "→" },
      { time: 23, icon: "moon", temp: 23, windSpeed: 10, windDirection: "→" },
      { time: 2, icon: "moon", temp: 22, windSpeed: 8, windDirection: "→" },
      { time: 5, icon: "moon", temp: 22, windSpeed: 7, windDirection: "→" },
    ],
  },
  "Cape Town, South Africa": {
    location: "Blouberg Beach",
    hours: [
      { time: 8, icon: "cloudSun", temp: 18, windSpeed: 12, windDirection: "↑" },
      { time: 11, icon: "sun", temp: 22, windSpeed: 18, windDirection: "↑" },
      { time: 14, icon: "sun", temp: 24, windSpeed: 22, windDirection: "↑" },
      { time: 17, icon: "sun", temp: 23, windSpeed: 20, windDirection: "↑" },
      { time: 20, icon: "moon", temp: 19, windSpeed: 15, windDirection: "↑" },
      { time: 23, icon: "moon", temp: 17, windSpeed: 12, windDirection: "↑" },
      { time: 2, icon: "moon", temp: 16, windSpeed: 10, windDirection: "↑" },
      { time: 5, icon: "moon", temp: 15, windSpeed: 8, windDirection: "↑" },
      { time: 8, icon: "cloudSun", temp: 17, windSpeed: 10, windDirection: "↑" },
      { time: 11, icon: "sun", temp: 21, windSpeed: 16, windDirection: "↑" },
      { time: 14, icon: "sun", temp: 23, windSpeed: 20, windDirection: "↑" },
      { time: 17, icon: "sun", temp: 22, windSpeed: 18, windDirection: "↑" },
      { time: 20, icon: "moon", temp: 18, windSpeed: 14, windDirection: "↑" },
      { time: 23, icon: "moon", temp: 16, windSpeed: 10, windDirection: "↑" },
      { time: 2, icon: "moon", temp: 15, windSpeed: 8, windDirection: "↑" },
      { time: 5, icon: "moon", temp: 14, windSpeed: 7, windDirection: "↑" },
    ],
  },
  "Cabarete, Dominican Republic": {
    location: "Cabarete Beach",
    hours: [
      { time: 8, icon: "cloudSun", temp: 25, windSpeed: 8, windDirection: "↖" },
      { time: 11, icon: "sun", temp: 28, windSpeed: 12, windDirection: "↖" },
      { time: 14, icon: "sun", temp: 30, windSpeed: 15, windDirection: "↖" },
      { time: 17, icon: "sun", temp: 29, windSpeed: 14, windDirection: "↖" },
      { time: 20, icon: "moon", temp: 26, windSpeed: 10, windDirection: "↖" },
      { time: 23, icon: "moon", temp: 25, windSpeed: 8, windDirection: "↖" },
      { time: 2, icon: "moon", temp: 24, windSpeed: 6, windDirection: "↖" },
      { time: 5, icon: "moon", temp: 24, windSpeed: 5, windDirection: "↖" },
      { time: 8, icon: "cloudSun", temp: 25, windSpeed: 7, windDirection: "↖" },
      { time: 11, icon: "sun", temp: 28, windSpeed: 12, windDirection: "↖" },
      { time: 14, icon: "sun", temp: 30, windSpeed: 15, windDirection: "↖" },
      { time: 17, icon: "sun", temp: 29, windSpeed: 13, windDirection: "↖" },
      { time: 20, icon: "moon", temp: 26, windSpeed: 9, windDirection: "↖" },
      { time: 23, icon: "moon", temp: 25, windSpeed: 7, windDirection: "↖" },
      { time: 2, icon: "moon", temp: 24, windSpeed: 6, windDirection: "↖" },
      { time: 5, icon: "moon", temp: 24, windSpeed: 5, windDirection: "↖" },
    ],
  },
  Dakhla: {
    location: "Dakhla Beach",
    hours: [
      { time: 8, icon: "sun", temp: 18, windSpeed: 15, windDirection: "↙" },
      { time: 11, icon: "sun", temp: 20, windSpeed: 18, windDirection: "↙" },
      { time: 14, icon: "sun", temp: 22, windSpeed: 15, windDirection: "←" },
      { time: 17, icon: "sun", temp: 21, windSpeed: 13, windDirection: "←" },
      { time: 20, icon: "moon", temp: 17, windSpeed: 14, windDirection: "←" },
      { time: 23, icon: "moon", temp: 16, windSpeed: 13, windDirection: "←" },
      { time: 2, icon: "moon", temp: 15, windSpeed: 12, windDirection: "←" },
      { time: 5, icon: "moon", temp: 14, windSpeed: 10, windDirection: "←" },
      { time: 8, icon: "sun", temp: 16, windSpeed: 10, windDirection: "←" },
      { time: 11, icon: "sun", temp: 19, windSpeed: 11, windDirection: "↖" },
      { time: 14, icon: "sun", temp: 21, windSpeed: 10, windDirection: "↖" },
      { time: 17, icon: "sun", temp: 20, windSpeed: 10, windDirection: "↖" },
      { time: 20, icon: "moon", temp: 17, windSpeed: 9, windDirection: "↑" },
      { time: 23, icon: "moon", temp: 16, windSpeed: 9, windDirection: "↑" },
      { time: 2, icon: "moon", temp: 15, windSpeed: 10, windDirection: "↑" },
      { time: 5, icon: "cloudMoon", temp: 15, windSpeed: 11, windDirection: "↑" },
    ],
  },
  Jericoacoara: {
    location: "Jericoacoara Beach",
    hours: [
      { time: 8, icon: "sun", temp: 25, windSpeed: 15, windDirection: "→" },
      { time: 11, icon: "sun", temp: 28, windSpeed: 18, windDirection: "→" },
      { time: 14, icon: "sun", temp: 30, windSpeed: 20, windDirection: "→" },
      { time: 17, icon: "sun", temp: 29, windSpeed: 18, windDirection: "→" },
      { time: 20, icon: "moon", temp: 26, windSpeed: 15, windDirection: "→" },
      { time: 23, icon: "moon", temp: 25, windSpeed: 12, windDirection: "→" },
      { time: 2, icon: "moon", temp: 24, windSpeed: 10, windDirection: "→" },
      { time: 5, icon: "moon", temp: 24, windSpeed: 8, windDirection: "→" },
      { time: 8, icon: "sun", temp: 25, windSpeed: 12, windDirection: "→" },
      { time: 11, icon: "sun", temp: 28, windSpeed: 16, windDirection: "→" },
      { time: 14, icon: "sun", temp: 30, windSpeed: 18, windDirection: "→" },
      { time: 17, icon: "sun", temp: 29, windSpeed: 16, windDirection: "→" },
      { time: 20, icon: "moon", temp: 26, windSpeed: 14, windDirection: "→" },
      { time: 23, icon: "moon", temp: 25, windSpeed: 12, windDirection: "→" },
      { time: 2, icon: "moon", temp: 24, windSpeed: 10, windDirection: "→" },
      { time: 5, icon: "moon", temp: 24, windSpeed: 8, windDirection: "→" },
    ],
  },
}

// Helper function to get the wind speed color
const getWindSpeedColor = (speed: number) => {
  if (speed < 6) return "bg-emerald-300"
  if (speed < 8) return "bg-emerald-400"
  if (speed < 10) return "bg-green-400"
  if (speed < 12) return "bg-green-500"
  if (speed < 14) return "bg-lime-500"
  if (speed < 16) return "bg-lime-400"
  if (speed < 18) return "bg-yellow-400"
  if (speed < 20) return "bg-yellow-300"
  return "bg-amber-300"
}

// Helper function to get the weather icon
const getWeatherIcon = (icon: string, className = "h-6 w-6") => {
  switch (icon) {
    case "sun":
      return <Sun className={`${className} text-yellow-400`} />
    case "cloudSun":
      return <Cloud className={`${className} text-white`} />
    case "cloud":
      return <Cloud className={`${className} text-white`} />
    case "cloudRain":
      return <CloudRain className={`${className} text-white`} />
    case "cloudLightning":
      return <CloudLightning className={`${className} text-yellow-300`} />
    case "moon":
      return <Moon className={`${className} text-gray-200`} />
    case "cloudMoon":
      return <CloudMoon className={`${className} text-gray-200`} />
    case "snow":
      return <Snowflake className={`${className} text-white`} />
    default:
      return <Sun className={`${className} text-yellow-400`} />
  }
}

interface ForecastChartProps {
  location: string
}

export default function ForecastChart({ location }: ForecastChartProps) {
  const [forecastData, setForecastData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use our mock data
    const locationKey = Object.keys(mockForecastData).find((key) =>
      key.toLowerCase().includes(location.toLowerCase().split(",")[0]),
    )

    if (locationKey) {
      setForecastData(mockForecastData[locationKey as keyof typeof mockForecastData])
    } else {
      // Default to first location if no match
      setForecastData(mockForecastData[Object.keys(mockForecastData)[0] as keyof typeof mockForecastData])
    }
  }, [location])

  if (!forecastData) {
    return (
      <div className="w-full bg-gray-800 bg-opacity-80 rounded-xl p-4 text-center text-white">
        <p>Loading forecast data...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-800 bg-opacity-80 rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold">{forecastData.location}</h3>
        <div className="flex items-center">
          <Image src="/windy-logo.png" alt="Windy.com" width={20} height={20} className="mr-1" />
          <span className="text-white text-xs opacity-70">Windy.com</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-max">
          {/* Time row */}
          <div className="flex">
            {forecastData.hours.map((hour: any, index: number) => (
              <div key={`time-${index}`} className="w-10 text-center text-white text-sm">
                {hour.time}
              </div>
            ))}
          </div>

          {/* Weather icons row */}
          <div className="flex my-1">
            {forecastData.hours.map((hour: any, index: number) => (
              <div key={`icon-${index}`} className="w-10 flex justify-center">
                {getWeatherIcon(hour.icon)}
              </div>
            ))}
          </div>

          {/* Temperature row */}
          <div className="flex mb-2">
            {forecastData.hours.map((hour: any, index: number) => (
              <div key={`temp-${index}`} className="w-10 text-center text-white text-sm">
                {hour.temp}°
              </div>
            ))}
          </div>

          {/* Wind speed row */}
          <div className="flex mb-1">
            {forecastData.hours.map((hour: any, index: number) => (
              <div
                key={`wind-${index}`}
                className={`w-10 text-center text-gray-800 font-medium ${getWindSpeedColor(hour.windSpeed)}`}
              >
                {hour.windSpeed}
              </div>
            ))}
          </div>

          {/* Wind direction row */}
          <div className="flex">
            {forecastData.hours.map((hour: any, index: number) => (
              <div key={`dir-${index}`} className="w-10 text-center text-white text-lg">
                {hour.windDirection}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
