import type React from "react"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Moon } from "lucide-react"

interface WeatherIconProps {
  iconCode: string
  size?: number
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, size = 24 }) => {
  // Map icon codes to Lucide icons
  const getIcon = () => {
    // First character is the main condition, second is day/night, third is variant
    const mainCondition = iconCode.substring(0, 2)
    const isDay = iconCode.includes("d")

    switch (mainCondition) {
      case "c0": // Clear
        return isDay ? <Sun size={size} className="text-yellow-400" /> : <Moon size={size} className="text-gray-300" />
      case "c1": // Few clouds
      case "c2": // Scattered clouds
        return <Cloud size={size} className="text-gray-400" />
      case "c3": // Broken clouds
      case "c4": // Overcast
        return <Cloud size={size} className="text-gray-500" />
      case "r0": // Light rain
      case "r1": // Moderate rain
      case "r2": // Heavy rain
        return <CloudRain size={size} className="text-blue-500" />
      case "d0": // Drizzle
        return <CloudDrizzle size={size} className="text-blue-400" />
      case "t0": // Thunderstorm
      case "t1": // Thunderstorm with rain
        return <CloudLightning size={size} className="text-yellow-500" />
      case "s0": // Light snow
      case "s1": // Snow
      case "s2": // Heavy snow
        return <CloudSnow size={size} className="text-blue-200" />
      case "f0": // Fog
      case "f1": // Mist
        return <CloudFog size={size} className="text-gray-400" />
      default:
        return <Sun size={size} className="text-yellow-400" />
    }
  }

  return getIcon()
}

export default WeatherIcon
