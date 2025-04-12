"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Wind } from "lucide-react"

interface KiteSizeCalculatorProps {
  windSpeed: number // Wind speed in knots
}

// Kite sizes commonly available
const kiteSizes = [5, 7, 9, 12, 14, 17]

export default function KiteSizeCalculator({ windSpeed }: KiteSizeCalculatorProps) {
  const [weight, setWeight] = useState(75) // Default weight in kg
  const [recommendations, setRecommendations] = useState<{ size: number; probability: number }[]>([])

  // Calculate kite size recommendations based on weight and wind speed
  useEffect(() => {
    // This is a simplified algorithm for demonstration purposes
    // In a real app, this would be more sophisticated

    const calculateRecommendations = () => {
      // Base calculation: lighter weight = smaller kite, stronger wind = smaller kite
      const weightFactor = weight / 75 // Normalize around 75kg
      const windFactor = 15 / windSpeed // Normalize around 15 knots

      // Ideal kite size for these conditions (simplified formula)
      const idealSize = 12 * weightFactor * windFactor

      // Calculate probability for each kite size based on distance from ideal
      const newRecommendations = kiteSizes.map((size) => {
        // Calculate distance from ideal (closer = higher probability)
        const distance = Math.abs(size - idealSize)

        // Convert distance to probability (inverse relationship)
        // Closer sizes get higher probability
        let probability = 100 * Math.exp(-0.3 * distance)

        // Adjust for extreme conditions
        if ((windSpeed > 25 && size > 12) || (windSpeed < 10 && size < 9)) {
          probability *= 0.5 // Reduce probability for unsafe combinations
        }

        // Ensure probability is between 0 and 100
        probability = Math.min(Math.max(probability, 0), 100)

        return {
          size,
          probability: Math.round(probability),
        }
      })

      // Sort by probability (highest first)
      newRecommendations.sort((a, b) => b.probability - a.probability)

      // Limit to top 3 recommendations
      setRecommendations(newRecommendations.slice(0, 3))
    }

    calculateRecommendations()
  }, [weight, windSpeed])

  return (
    <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 shadow-md">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <Wind className="h-5 w-5 mr-2 text-sky-400" />
        Kite Size Calculator
      </h3>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-white/80 text-sm">Rider Weight</span>
          <span className="text-white font-medium">{weight} kg</span>
        </div>
        <Slider
          value={[weight]}
          min={40}
          max={120}
          step={1}
          onValueChange={(value) => setWeight(value[0])}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-white/60">
          <span>40kg</span>
          <span>80kg</span>
          <span>120kg</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-white/80 text-sm mb-2 bg-slate-800/50 p-2 rounded-md inline-block">
          Recommended kite sizes for {windSpeed} knots:
        </div>

        {recommendations.map((rec) => (
          <div key={rec.size} className="flex items-center">
            <div className="w-12 text-white font-medium">{rec.size}m</div>
            <div className="flex-1 bg-slate-800/50 rounded-full h-2 mx-2">
              <div
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full"
                style={{ width: `${rec.probability}%` }}
              />
            </div>
            <div className="w-10 text-right text-white/80 text-sm">{rec.probability}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
