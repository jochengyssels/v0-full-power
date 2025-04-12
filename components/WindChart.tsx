"use client"

import type React from "react"
import { useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDay } from "../utils/weatherUtils"
import WeatherIcon from "./WeatherIcon"

interface ChartItem {
  ts: string // Unix timestamp
  wind_spd: number // Wind speed in knots
  wind_gust_spd: number // Gust speed in knots
  temp: number // Temperature
  weather?: {
    icon: string // Weather icon code
  }
  windDirection?: number // Wind direction in degrees
}

interface WindChartProps {
  data: ChartItem[]
}

const WindChart: React.FC<WindChartProps> = ({ data }) => {
  const [activePeriod, setActivePeriod] = useState<string>("day-0")

  // Safely process the data
  const processData = () => {
    try {
      // Group data by day (up to 3 days)
      const dayGroups: Record<string, ChartItem[]> = {}

      // Safely process each data item
      data.forEach((item) => {
        if (!item || !item.ts) return

        try {
          const date = new Date(Number(item.ts) * 1000)
          const day = date.toISOString().split("T")[0]

          if (!dayGroups[day]) {
            dayGroups[day] = []
          }

          dayGroups[day].push(item)
        } catch (e) {
          console.error("Error processing data item:", e)
        }
      })

      // Create day labels
      const dayLabels = Object.keys(dayGroups)
        .slice(0, 3)
        .map((day, index) => {
          const date = new Date(day)
          return {
            id: `day-${index}`,
            label: formatDay(date),
          }
        })

      // Process chart data
      const chartData: any[] = []

      const allDaysData = Object.values(dayGroups).flat()

      // Aggregate minute data to hourly intervals for display
      const aggregatedData = allDaysData.reduce(
        (acc, item) => {
          const date = new Date(Number(item.ts) * 1000)
          // Create a unique key that includes both date and hour (24-hour format)
          const hourKey = `${date.toISOString().split("T")[0]}-${date.getHours()}`

          if (!acc[hourKey]) {
            acc[hourKey] = {
              count: 0,
              wind_sum: 0,
              gust_sum: 0,
              temp_sum: 0,
              hour: date.getHours(), // Use 24-hour format
              day: date.toISOString().split("T")[0],
              dayIndex: Object.keys(dayGroups).indexOf(date.toISOString().split("T")[0]),
              icon: item.weather?.icon || "c01d",
              timestamp: date.getTime(),
              windDirection: item.windDirection || 0,
              // Add a display hour for tooltip
              displayHour: date.getHours().toString().padStart(2, "0") + ":00",
            }
          }

          acc[hourKey].count += 1
          acc[hourKey].wind_sum += item.wind_spd
          acc[hourKey].gust_sum += item.wind_gust_spd
          acc[hourKey].temp_sum += item.temp

          return acc
        },
        {} as Record<string, any>,
      )

      // Convert aggregated data to chart format
      Object.values(aggregatedData).forEach((hourData) => {
        if (hourData.count > 0) {
          chartData.push({
            hour: hourData.hour,
            wind: Math.round(hourData.wind_sum / hourData.count),
            gust: Math.round(hourData.gust_sum / hourData.count),
            temp: Math.round(hourData.temp_sum / hourData.count),
            fullHour: `${hourData.hour}:00`,
            day: hourData.day,
            dayIndex: hourData.dayIndex,
            icon: hourData.icon,
            displayHour: hourData.displayHour,
            windDirection: hourData.windDirection,
          })
        }
      })

      // Sort chart data
      chartData.sort((a, b) => {
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
        return a.hour - b.hour
      })

      return {
        dayLabels,
        chartData,
      }
    } catch (e) {
      console.error("Error processing chart data:", e)
      return {
        dayLabels: [],
        chartData: [],
      }
    }
  }

  const { dayLabels, chartData } = processData()

  // Get filtered data for the active day
  const activeDay = Number.parseInt(activePeriod.split("-")[1])
  const filteredData = chartData.filter((item) => item.dayIndex === activeDay)

  // Find best time for the selected day
  const getBestTime = () => {
    if (!filteredData || filteredData.length === 0) return null

    // Sort by ideal wind conditions (15-20 knots is ideal)
    const sortedData = [...filteredData].sort((a, b) => {
      // Prioritize wind speeds between 15-20 knots
      const aIdeal = a.wind >= 15 && a.wind <= 20 ? 0 : Math.abs(a.wind - 17.5)
      const bIdeal = b.wind >= 15 && b.wind <= 20 ? 0 : Math.abs(b.wind - 17.5)
      return aIdeal - bIdeal
    })

    return sortedData[0]
  }

  const dayBestTime = getBestTime()

  // Function to determine kite size recommendation
  const getKiteRecommendation = (windSpeed: number) => {
    if (windSpeed < 5) return "No kite"
    if (windSpeed < 12) return "12-14m"
    if (windSpeed < 18) return "9-11m"
    if (windSpeed < 25) return "7-8m"
    return "5-6m"
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-lg border border-white/40 bg-white/80 backdrop-blur-sm">
          <p className="font-medium">{`${label}:00`}</p>
          {payload[0] && payload[0].value !== undefined && (
            <p className="text-sky-600">{`Wind: ${payload[0].value} knots`}</p>
          )}
          {payload[1] && payload[1].value !== undefined && (
            <p className="text-amber-600">{`Gust: ${payload[1].value} knots`}</p>
          )}
        </div>
      )
    }
    return null
  }

  const maxWindSpeed = Math.max(...filteredData.map((item) => item.wind), ...filteredData.map((item) => item.gust))

  return (
    <div className="bg-transparent rounded-xl p-5 w-full">
      <div className="mb-2">
        {/* Day selection tabs and legend */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-2 ml-[40px]">
            {dayLabels.map((day) => (
              <button
                key={day.id}
                onClick={() => setActivePeriod(day.id)}
                className={`px-3 py-1 text-xs rounded-full transition-colors font-medium ${
                  activePeriod === day.id
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-700/40 p-1.5 rounded-lg mr-[40px]">
            <div className="flex items-center mr-4">
              <div className="w-2.5 h-2.5 bg-sky-400 rounded-full mr-1.5"></div>
              <span className="text-white/90 text-xs">Wind Speed</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 bg-amber-400 rounded-full mr-1.5"></div>
              <span className="text-white/90 text-xs">Wind Gust</span>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature icons at the top */}
      <div className="relative w-full min-w-[800px] px-[40px] mb-2 ml-[20px]">
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${filteredData.length}, 1fr)`,
            width: "100%",
            marginLeft: "-20px",
          }}
        >
          {filteredData.slice(0, 24).map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <div className="text-xs text-white">{item.temp}°</div>
              <WeatherIcon iconCode={item.icon} size={16} />
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[280px] w-full">
        <div className="h-60 w-full min-w-[800px] relative">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="gustGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.07)"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12, fill: "rgba(255,255,255,0.8)" }}
                  tickFormatter={(hour) => {
                    // Format hour to show 24H format
                    return `${hour.toString().padStart(2, "0")}`
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "rgba(255,255,255,0.8)" }}
                  domain={[0, Math.ceil(maxWindSpeed / 4) * 4 + 4]}
                  ticks={[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]}
                  label={{
                    value: "Wind (knots)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "rgba(255,255,255,0.8)", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Current time reference line */}
                <ReferenceLine
                  x={new Date().getHours()}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: "Now",
                    position: "top",
                    fill: "white",
                    fontSize: 10,
                  }}
                />

                {/* Golden kite window (2-hour period with best conditions) */}
                {dayBestTime && (
                  <ReferenceArea
                    x1={Math.max(0, dayBestTime.hour - 1)}
                    x2={Math.min(23, dayBestTime.hour + 1)}
                    fill="rgba(255, 215, 0, 0.15)"
                    fillOpacity={0.6}
                    stroke="rgba(255, 215, 0, 0.5)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    label={{
                      value: "Golden Window",
                      position: "insideTop",
                      fill: "rgba(255, 215, 0, 0.8)",
                      fontSize: 10,
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="wind"
                  stroke="#0ea5e9"
                  fill="rgba(14, 165, 233, 0.15)"
                  fillOpacity={0.6}
                  strokeWidth={2.5}
                  activeDot={{ r: 6, fill: "#0ea5e9", stroke: "white" }}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="gust"
                  stroke="#f59e0b"
                  fill="url(#gustGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#f59e0b", stroke: "white" }}
                  isAnimationActive={false}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-white/70">No data available for this day</div>
          )}
        </div>
      </ScrollArea>

      {/* Wind direction indicators */}
      <div className="relative w-full min-w-[800px] px-[40px] mt-[-35px] ml-[20px]">
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${filteredData.length}, 1fr)`,
            width: "100%",
            marginLeft: "-20px",
          }}
        >
          {filteredData.map((item, index) => {
            const direction = item.windDirection || (index * 30) % 360
            return (
              <div key={`dir-${index}`} className="flex flex-col items-center justify-center">
                <div
                  className="text-white/70 transform h-4 flex items-center justify-center"
                  style={{ transform: `rotate(${direction}deg)` }}
                >
                  ↑
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-700/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-slate-600/30">
          <h3 className="text-sm font-medium text-white/80 mb-1">Best Time Today</h3>
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-white">
              {dayBestTime ? `${dayBestTime.hour}:00` : "Not available"}
            </div>
            <div className="text-sm bg-sky-500/20 text-sky-100 px-2 py-0.5 rounded-full">
              {dayBestTime ? `${dayBestTime.wind} knots` : ""}
            </div>
          </div>
        </div>

        <div className="bg-slate-700/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-slate-600/30">
          <h3 className="text-sm font-medium text-white/80 mb-1">Recommended Kite</h3>
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-white">
              {dayBestTime ? getKiteRecommendation(dayBestTime.wind || 0) : "Not available"}
            </div>
            <div className="text-sm bg-amber-500/20 text-amber-100 px-2 py-0.5 rounded-full">
              {dayBestTime ? `${dayBestTime.temp}°C` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindChart
