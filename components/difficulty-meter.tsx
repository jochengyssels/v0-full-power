"use client"

import { cn } from "@/lib/utils"

interface DifficultyMeterProps {
  difficulty: string
  className?: string
}

export default function DifficultyMeter({ difficulty, className }: DifficultyMeterProps) {
  // Normalize difficulty to a value between 0 and 100
  const getDifficultyValue = (diff: string): number => {
    const map: Record<string, number> = {
      beginner: 20,
      intermediate: 50,
      advanced: 80,
      expert: 100,
    }
    return map[diff.toLowerCase()] || 50
  }

  const value = getDifficultyValue(difficulty)

  // Get color based on difficulty
  const getColor = (value: number): string => {
    if (value <= 25) return "bg-green-500"
    if (value <= 50) return "bg-emerald-500"
    if (value <= 75) return "bg-amber-500"
    return "bg-red-500"
  }

  const color = getColor(value)

  return (
    <div className={cn("relative w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}>
      <div className={`absolute left-0 top-0 h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      <div className="absolute -top-6 left-0 right-0 text-center text-xs text-white capitalize">{difficulty}</div>
    </div>
  )
}
