"use client"

import { X } from "lucide-react"
import Image from "next/image"
import RatingStars from "./rating-stars"
import PriceRangeIndicator from "./price-range-indicator"

interface KiteschoolComparisonProps {
  schools: any[]
  onClose: () => void
  onRemoveSchool: (id: string) => void
}

export default function KiteschoolComparison({ schools, onClose, onRemoveSchool }: KiteschoolComparisonProps) {
  if (schools.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare Kiteschools ({schools.length})</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Comparison content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <div key={school.id} className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden relative">
                {/* Remove button */}
                <button
                  onClick={() => onRemoveSchool(school.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md z-10"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>

                {/* School header */}
                <div className="h-24 w-full relative" style={{ backgroundColor: school.color || "#3a7cc3" }}>
                  {/* Logo */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 bg-white">
                    <Image
                      src={
                        school.logo_url || `/placeholder.svg?height=80&width=80&query=kiteschool ${school.company_name}`
                      }
                      alt={`${school.company_name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* School info */}
                <div className="pt-12 px-4 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                    {school.company_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-1">
                    {school.location}, {school.country}
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center mt-3">
                    <RatingStars rating={school.google_review_score} />
                  </div>

                  {/* Comparison table */}
                  <div className="mt-6 space-y-3">
                    {/* Pricing */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pricing</span>
                      <div>
                        {school.course_pricing ? (
                          <PriceRangeIndicator priceRange={school.course_pricing} />
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>
                        )}
                      </div>
                    </div>

                    {/* Owner/Instructor */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner/Instructor</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {school.owner_name || "Not specified"}
                      </span>
                    </div>

                    {/* Website */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</span>
                      {school.website_url ? (
                        <a
                          href={school.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Visit site
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
