"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { fetchWeatherForecast, msToKnots } from "@/utils/weather-api"
import { Loader2 } from "lucide-react"

interface GoldenTimeWindowChartProps {
  location: string
  latitude?: number
  longitude?: number
}

// Mock coordinates for locations if not provided
const mockLocationData: Record<string, { lat: number; lon: number }> = {
  Tarifa: { lat: 36.0143, lon: -5.6044 },
  Maui: { lat: 20.7984, lon: -156.3319 },
  "Cape Town": { lat: -33.9249, lon: 18.4241 },
  Cabarete: { lat: 19.758, lon: -70.4193 },
  Dakhla: { lat: 23.7136, lon: -15.9355 },
  Jericoacoara: { lat: -2.7975, lon: -40.5137 },
  Essaouira: { lat: 31.5085, lon: -9.7595 },
}

export default function GoldenTimeWindowChart({ location, latitude, longitude }: GoldenTimeWindowChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Get coordinates for the location
        let lat = latitude
        let lon = longitude

        if (!lat || !lon) {
          // Find coordinates from our mock data
          const locationKey = Object.keys(mockLocationData).find((key) =>
            location.toLowerCase().includes(key.toLowerCase()),
          )

          if (locationKey) {
            lat = mockLocationData[locationKey].lat
            lon = mockLocationData[locationKey].lon
          } else {
            throw new Error("Location coordinates not found")
          }
        }

        // Fetch weather forecast data
        const forecastData = await fetchWeatherForecast(lat, lon, 48)

        if (!forecastData || !forecastData.timelines || !forecastData.timelines.hourly) {
          throw new Error("Failed to fetch forecast data")
        }

        // Process the forecast data for the chart
        const now = new Date()
        const processedData = forecastData.timelines.hourly.map((hour, index) => {
          const windSpeedKnots = msToKnots(hour.values.windSpeed)
          const windGustKnots = msToKnots(hour.values.windGust)
          const date = new Date(hour.time)

          // Check if this is the current hour
          const isCurrentHour = Math.abs(date.getTime() - now.getTime()) < 1800000 // Within 30 minutes
          if (isCurrentHour) {
            setCurrentTimeIndex(index)
          }

          // Format date for display
          const formattedDate = date.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })

          // Format time for display
          const formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })

          return {
            index,
            timestamp: date.getTime(),
            date: formattedDate,
            time: formattedTime,
            windSpeed: Math.round(windSpeedKnots * 10) / 10,
            windGust: Math.round(windGustKnots * 10) / 10,
            isGoldenWindow: windSpeedKnots >= 15 && windSpeedKnots <= 25,
            label: `${formattedTime} ${formattedDate}`,
          }
        })

        setChartData(processedData)
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError(err instanceof Error ? err.message : "An error occurred")

        // Generate mock data as fallback
        const mockData = generateMockData()
        setChartData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location, latitude, longitude])

  // Generate mock data as fallback
  const generateMockData = () => {
    const data = []
    const now = new Date()

    for (let i = 0; i < 48; i++) {
      const date = new Date(now.getTime() + i * 60 * 60 * 1000)

      // Generate realistic wind patterns
      const baseWindSpeed = 10 + Math.sin(i / 6) * 8
      const windSpeed = Math.max(0, baseWindSpeed + (Math.random() * 4 - 2))
      const windGust = windSpeed + 2 + Math.random() * 5

      data.push({
        index: i,
        timestamp: date.getTime(),
        date: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
        windSpeed: Math.round(windSpeed * 10) / 10,
        windGust: Math.round(windGust * 10) / 10,
        isGoldenWindow: windSpeed >= 15 && windSpeed <= 25,
      })
    }

    return data
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-2 rounded shadow-md border border-gray-200">
          <p className="font-medium text-gray-900">{data.time}</p>
          <p className="text-gray-900">{data.date}</p>
          <p className="text-gray-700">
            Wind: <span className="font-medium">{data.windSpeed} knots</span>
          </p>
          <p className="text-gray-700">
            Gust: <span className="font-medium">{data.windGust} knots</span>
          </p>
          <p className={data.isGoldenWindow ? "text-green-600 font-medium" : "text-gray-500"}>
            {data.isGoldenWindow ? "Optimal Conditions" : "Not Optimal"}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white/10 rounded-lg">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
        <span className="ml-2 text-white">Loading forecast data...</span>
      </div>
    )
  }

  if (error && chartData.length === 0) {
    return (
      <div className="text-white/80 text-sm p-4 text-center h-48 flex items-center justify-center bg-white/10 rounded-lg">
        <p>Unable to load forecast data. Please try again later.</p>
      </div>
    )
  }

  // Find the min and max wind speeds for chart scaling
  const allWindValues = chartData.flatMap((d) => [d.windSpeed, d.windGust])
  const minWindSpeed = Math.max(0, Math.floor(Math.min(...allWindValues) - 2))
  const maxWindSpeed = Math.ceil(Math.max(...allWindValues) + 2)

  // Create tick values for the y-axis
  const yTicks = []
  for (let i = minWindSpeed; i <= maxWindSpeed; i += 5) {
    yTicks.push(i)
  }

  // Create custom x-axis ticks (every 6 hours)
  const xTicks = chartData.filter((_, i) => i % 6 === 0).map((d) => d.index)

  // Group data by day for better visualization
  const days = chartData.reduce(
    (acc, item) => {
      const date = new Date(item.timestamp)
      const day = date.toLocaleDateString()

      if (!acc[day]) {
        acc[day] = []
      }

      acc[day].push(item)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Get day labels for the chart
  const dayLabels = Object.keys(days).map((day) => {
    const date = new Date(day)
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
  })

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Wind Speed Forecast</h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            {/* Golden window zone (15-25 knots) */}
            <ReferenceArea
              y1={15}
              y2={25}
              fill="rgba(255, 215, 0, 0.2)"
              fillOpacity={0.3}
              stroke="rgba(255, 215, 0, 0.5)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            <XAxis
              dataKey="index"
              ticks={xTicks}
              tickFormatter={(value) => {
                const item = chartData.find((d) => d.index === value)
                return item ? item.time : ""
              }}
              tick={{ fill: "white", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.3)" }}
            />

            <YAxis
              domain={[minWindSpeed, maxWindSpeed]}
              ticks={yTicks}
              tick={{ fill: "white", fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
              axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.3)" }}
              label={{
                value: "Wind (knots)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "white", fontSize: 12 },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Current time reference line */}
            {currentTimeIndex !== null && (
              <ReferenceLine
                x={currentTimeIndex}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={2}
                label={{
                  value: "Now",
                  position: "top",
                  fill: "white",
                  fontSize: 10,
                }}
              />
            )}

            {/* Wind speed line */}
            <Line
              type="monotone"
              dataKey="windSpeed"
              stroke="#3a7cc3"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props
                const isGolden = payload.isGoldenWindow

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={isGolden ? "#ffd700" : "#3a7cc3"}
                    stroke="white"
                    strokeWidth={1}
                  />
                )
              }}
              activeDot={{ r: 6, fill: "#ffd700", stroke: "white", strokeWidth: 2 }}
            />

            {/* Wind gust line */}
            <Line
              type="monotone"
              dataKey="windGust"
              stroke="#ff6b6b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, fill: "#ff6b6b", stroke: "white", strokeWidth: 2 }}
            />

            {/* Golden window threshold lines */}
            <ReferenceLine y={15} stroke="rgba(255, 215, 0, 0.7)" strokeDasharray="3 3" />
            <ReferenceLine y={25} stroke="rgba(255, 215, 0, 0.7)" strokeDasharray="3 3" />

            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => <span style={{ color: "white" }}>{value}</span>}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center mt-3">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
          <span className="text-white text-xs">Golden Window (15-25 knots)</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
          <span className="text-white text-xs">Wind Speed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
          <span className="text-white text-xs">Wind Gust</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        {dayLabels.map((label, index) => (
          <div key={index} className="text-white/60 text-xs">
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
