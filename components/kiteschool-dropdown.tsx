"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MapPin, Star, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"

// Sample kiteschool data
const kiteschools = [
  {
    id: 1,
    name: "KiteVenture School",
    location: "Tarifa, Spain",
    rating: 4.8,
    description: "Professional kitesurfing lessons for all levels with certified instructors.",
    website: "https://kiteventure.example.com",
    logo: "/images/kvs-logo.png",
  },
  {
    id: 2,
    name: "ProKite Academy",
    location: "Cabarete, Dominican Republic",
    rating: 4.9,
    description: "Learn kitesurfing in the perfect conditions with personalized coaching.",
    website: "https://prokite.example.com",
    logo: "/images/prokite-logo.png",
  },
  {
    id: 3,
    name: "Kite Masters",
    location: "Cape Town, South Africa",
    rating: 4.7,
    description: "Group and private lessons with equipment rental and accommodation packages.",
    website: "https://kitemasters.example.com",
    logo: null,
  },
  {
    id: 4,
    name: "Breeze Kiteboarding",
    location: "Maui, Hawaii",
    rating: 4.9,
    description: "Premium kiteboarding instruction in one of the world's best locations.",
    website: "https://breezekite.example.com",
    logo: null,
  },
]

export default function KiteschoolDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative z-20 flex justify-center">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-sky-400/30 shadow-md"
      >
        <span>Learn to kite?</span>
        {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
      </button>

      {/* Dropdown content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">Kitesurfing Schools</h3>
              <p className="text-white/70 text-sm mb-3">
                Find certified instructors and schools to learn kitesurfing safely.
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {kiteschools.map((school) => (
                <div
                  key={school.id}
                  className="p-4 border-t border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {school.logo ? (
                        <div className="mr-3 flex-shrink-0">
                          <Image
                            src={school.logo || "/placeholder.svg"}
                            alt={`${school.name} logo`}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-slate-700 rounded-md mr-3 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {school.name.charAt(0)}
                        </div>
                      )}
                      <h4 className="text-white font-medium">{school.name}</h4>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs ml-1">{school.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-white/60 text-xs mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{school.location}</span>
                  </div>
                  <p className="text-white/80 text-sm mt-2">{school.description}</p>
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sky-400 text-xs mt-2 hover:text-sky-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>Visit website</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-700/50 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 text-sm hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
