"use client"

import { useState } from "react"
import { DollarSign, Info } from "lucide-react"

interface PriceRangeIndicatorProps {
  priceRange: string
  className?: string
}

export default function PriceRangeIndicator({ priceRange, className = "" }: PriceRangeIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Extract currency symbol and price range
  const currencySymbol = priceRange?.match(/[€$£]/)?.[0] || "€"
  const numbers = priceRange?.match(/[0-9]+/g) || []

  // Default values if we can't parse the price range
  let minPrice = 0
  let maxPrice = 0

  if (numbers.length >= 2) {
    minPrice = Number.parseInt(numbers[0], 10)
    maxPrice = Number.parseInt(numbers[1], 10)
  } else if (numbers.length === 1) {
    minPrice = Number.parseInt(numbers[0], 10)
    maxPrice = minPrice
  }

  // Calculate affordability level (1-5)
  const affordabilityLevel = calculateAffordabilityLevel(minPrice, maxPrice)

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <DollarSign
              key={index}
              size={16}
              className={`${index < affordabilityLevel ? "text-green-500" : "text-gray-300 dark:text-gray-600"}`}
            />
          ))}
        </div>
        <button
          className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info size={14} />
        </button>
      </div>

      {showTooltip && (
        <div className="absolute z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg">
          Price range: {priceRange}
          <div className="mt-1 text-gray-300">Based on typical course pricing in the region.</div>
        </div>
      )}
    </div>
  )
}

// Helper function to calculate affordability level
function calculateAffordabilityLevel(minPrice: number, maxPrice: number): number {
  const avgPrice = (minPrice + maxPrice) / 2

  if (avgPrice < 100) return 1
  if (avgPrice < 200) return 2
  if (avgPrice < 300) return 3
  if (avgPrice < 400) return 4
  return 5
}
