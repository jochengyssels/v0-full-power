"use client"

import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number | string | null
  maxRating?: number
  className?: string
  showValue?: boolean
}

export default function RatingStars({ rating, maxRating = 5, className = "", showValue = true }: RatingStarsProps) {
  // Convert rating to number
  const numericRating = typeof rating === "string" ? Number.parseFloat(rating) : rating || 0

  // Calculate filled stars
  const filledStars = Math.floor(numericRating)

  // Calculate partial star
  const partialStar = numericRating - filledStars

  // Calculate empty stars
  const emptyStars = maxRating - filledStars - (partialStar > 0 ? 1 : 0)

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Filled stars */}
        {Array.from({ length: filledStars }).map((_, i) => (
          <Star key={`filled-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}

        {/* Partial star */}
        {partialStar > 0 && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>

      {showValue && numericRating > 0 && (
        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{numericRating.toFixed(1)}</span>
      )}
    </div>
  )
}
