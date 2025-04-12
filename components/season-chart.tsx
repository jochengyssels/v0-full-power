"use client"

import { cn } from "@/lib/utils"

interface SeasonChartProps {
  bestMonths: string[]
  className?: string
}

export default function SeasonChart({ bestMonths, className }: SeasonChartProps) {
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {allMonths.map((month) => {
        const isGood = bestMonths.includes(month)
        return (
          <div
            key={month}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium",
              isGood ? "bg-emerald-500 text-white" : "bg-slate-700/30 text-white/50",
            )}
          >
            {month}
          </div>
        )
      })}
    </div>
  )
}
