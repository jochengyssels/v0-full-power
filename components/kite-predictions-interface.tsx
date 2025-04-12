"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Search, Wind, Sun, CloudRain, MapPin, Calendar, BarChart2, Compass, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/magicui/animated-beam"

const IconCircle = ({
  className,
  children,
  ref,
}: {
  className?: string
  children?: React.ReactNode
  ref: React.RefObject<HTMLDivElement>
}) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-14 items-center justify-center rounded-full border bg-white/90 p-3 shadow-lg transition-all hover:shadow-xl hover:scale-105",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default function KitePredictionsInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const windRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const rainRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef<HTMLDivElement>(null)
  const compassRef = useRef<HTMLDivElement>(null)
  const energyRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for kite predictions:", searchQuery)
    // Add your search logic here
  }

  return (
    <div
      className="relative flex h-[600px] w-full items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-b from-sky-50 to-white p-8 md:shadow-xl"
      ref={containerRef}
    >
      {/* Central Search Bar */}
      <div
        ref={searchBarRef}
        className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 md:w-96"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your command..."
              className="w-full h-14 px-5 pr-16 rounded-full border-2 border-emerald-200 focus:border-emerald-400 focus:outline-none shadow-md text-gray-700"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Circular arrangement of icons around the search bar */}
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] transform -translate-x-1/2 -translate-y-1/2">
        {/* Top */}
        <IconCircle
          ref={windRef}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-emerald-200"
        >
          <Wind className="h-7 w-7 text-emerald-600" />
        </IconCircle>

        {/* Top Right */}
        <IconCircle ref={sunRef} className="absolute top-[15%] right-[15%] border-amber-200">
          <Sun className="h-7 w-7 text-amber-500" />
        </IconCircle>

        {/* Right */}
        <IconCircle
          ref={locationRef}
          className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 border-rose-200"
        >
          <MapPin className="h-7 w-7 text-rose-500" />
        </IconCircle>

        {/* Bottom Right */}
        <IconCircle ref={timeRef} className="absolute bottom-[15%] right-[15%] border-purple-200">
          <Calendar className="h-7 w-7 text-purple-500" />
        </IconCircle>

        {/* Bottom */}
        <IconCircle
          ref={dataRef}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-blue-200"
        >
          <BarChart2 className="h-7 w-7 text-blue-500" />
        </IconCircle>

        {/* Bottom Left */}
        <IconCircle ref={compassRef} className="absolute bottom-[15%] left-[15%] border-indigo-200">
          <Compass className="h-7 w-7 text-indigo-500" />
        </IconCircle>

        {/* Left */}
        <IconCircle
          ref={rainRef}
          className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 border-sky-200"
        >
          <CloudRain className="h-7 w-7 text-sky-500" />
        </IconCircle>

        {/* Top Left */}
        <IconCircle ref={energyRef} className="absolute top-[15%] left-[15%] border-yellow-200">
          <Zap className="h-7 w-7 text-yellow-500" />
        </IconCircle>
      </div>

      {/* Animated Beams connecting all icons to the search bar */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={windRef}
        toRef={searchBarRef}
        pathColor="#d1fae5"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#10b981"
        gradientStopColor="#059669"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={sunRef}
        toRef={searchBarRef}
        pathColor="#fef3c7"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#f59e0b"
        gradientStopColor="#d97706"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={rainRef}
        toRef={searchBarRef}
        pathColor="#e0f2fe"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#0ea5e9"
        gradientStopColor="#0284c7"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={locationRef}
        toRef={searchBarRef}
        pathColor="#fee2e2"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#ef4444"
        gradientStopColor="#dc2626"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={timeRef}
        toRef={searchBarRef}
        pathColor="#f3e8ff"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#a855f7"
        gradientStopColor="#9333ea"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={dataRef}
        toRef={searchBarRef}
        pathColor="#dbeafe"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#3b82f6"
        gradientStopColor="#2563eb"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={compassRef}
        toRef={searchBarRef}
        pathColor="#e0e7ff"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#6366f1"
        gradientStopColor="#4f46e5"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={energyRef}
        toRef={searchBarRef}
        pathColor="#fef9c3"
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#eab308"
        gradientStopColor="#ca8a04"
      />
    </div>
  )
}
