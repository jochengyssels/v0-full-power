"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Globe, ChevronDown, ChevronUp, Users, Calendar, Wind } from "lucide-react"
import RatingStars from "./rating-stars"
import PriceRangeIndicator from "./price-range-indicator"

interface KiteschoolCardProps {
  school: {
    id: string
    company_name: string
    location: string
    country: string
    google_review_score: string | null
    owner_name: string | null
    website_url: string | null
    course_pricing: string | null
    logo_url: string | null
    color?: string
  }
  onSelect?: (id: string) => void
  isSelected?: boolean
}

export default function KiteschoolCard({ school, onSelect, isSelected = false }: KiteschoolCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Generate a placeholder image URL if no logo is provided
  const logoUrl = school.logo_url || `/placeholder.svg?height=80&width=80&query=kiteschool ${school.company_name}`

  // Generate a background color style based on the school's color or a default
  const bgColorStyle = {
    backgroundColor: school.color || "#3a7cc3",
  }

  // Handle card click
  const handleCardClick = () => {
    setExpanded(!expanded)
  }

  // Handle selection for comparison
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect(school.id)
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
        expanded ? "shadow-lg" : ""
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onClick={handleCardClick}
    >
      {/* Header with color from school */}
      <div className="h-3 w-full" style={bgColorStyle}></div>

      {/* Main card content */}
      <div className="p-4">
        <div className="flex items-center">
          {/* Logo */}
          <div className="relative w-16 h-16 mr-4 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white flex-shrink-0">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={`${school.company_name} logo`}
              fill
              className="object-cover"
            />
          </div>

          {/* Basic info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{school.company_name}</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">
                {school.location}, {school.country}
              </span>
            </div>

            {/* Rating */}
            <div className="mt-2">
              <RatingStars rating={school.google_review_score} />
            </div>
          </div>

          {/* Expand/collapse button */}
          <button
            className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Price indicator */}
        {school.course_pricing && (
          <div className="mt-3">
            <PriceRangeIndicator priceRange={school.course_pricing} />
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Owner info */}
            {school.owner_name && (
              <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span>
                  Owner/Instructor: <span className="font-medium">{school.owner_name}</span>
                </span>
              </div>
            )}

            {/* Course info */}
            <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-green-500" />
              <span>Courses available year-round</span>
            </div>

            {/* Equipment info */}
            <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-300">
              <Wind className="w-4 h-4 mr-2 text-purple-500" />
              <span>Equipment rental available</span>
            </div>

            {/* Website link */}
            {school.website_url && (
              <div className="mt-4">
                <a
                  href={school.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Visit Website
                </a>

                {onSelect && (
                  <button
                    onClick={handleSelect}
                    className={`ml-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      isSelected
                        ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {isSelected ? "Remove" : "Compare"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
