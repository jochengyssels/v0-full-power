"use client"

import { useEffect, useRef } from "react"

interface WindRoseProps {
  directions: {
    direction: string
    percentage: number
  }[]
  size?: number
  className?: string
}

export default function WindRose({ directions, size = 120, className = "" }: WindRoseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Convert direction string to angle in radians
  const directionToAngle = (direction: string): number => {
    const dirMap: Record<string, number> = {
      N: 0,
      NNE: Math.PI / 8,
      NE: Math.PI / 4,
      ENE: (3 * Math.PI) / 8,
      E: Math.PI / 2,
      ESE: (5 * Math.PI) / 8,
      SE: (3 * Math.PI) / 4,
      SSE: (7 * Math.PI) / 8,
      S: Math.PI,
      SSW: (9 * Math.PI) / 8,
      SW: (5 * Math.PI) / 4,
      WSW: (11 * Math.PI) / 8,
      W: (3 * Math.PI) / 2,
      WNW: (13 * Math.PI) / 8,
      NW: (7 * Math.PI) / 4,
      NNW: (15 * Math.PI) / 8,
    }
    return dirMap[direction] || 0
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // If we're loading images for the canvas, make sure to use 'new Image()'
    // Assuming needToLoadImages and imageUrl are defined or passed as props
    const needToLoadImages = false // Replace with actual condition
    const imageUrl = "" // Replace with actual image URL

    if (needToLoadImages) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imageUrl
      img.onload = () => {
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, size, size)
      }
    }

    // Draw background circle
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.fill()

    // Draw direction segments
    directions.forEach(({ direction, percentage }) => {
      const angle = directionToAngle(direction)
      const radius = (size / 2 - 2) * (percentage / 100)

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(size / 2, size / 2)
      ctx.arc(size / 2, size / 2, radius, angle - Math.PI / 16, angle + Math.PI / 16)
      ctx.closePath()

      // Fill with gradient
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, radius)
      gradient.addColorStop(0, "rgba(58, 124, 195, 0.8)")
      gradient.addColorStop(1, "rgba(58, 124, 195, 0.2)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw compass directions
    const compassDirections = ["N", "E", "S", "W"]
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]

    ctx.font = `${size / 15}px sans-serif`
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    compassDirections.forEach((dir, i) => {
      const angle = angles[i]
      const x = size / 2 + (size / 2 - 10) * Math.sin(angle)
      const y = size / 2 - (size / 2 - 10) * Math.cos(angle)
      ctx.fillText(dir, x, y)
    })

    // Draw center dot
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, 2, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
  }, [directions, size])

  return <canvas ref={canvasRef} width={size} height={size} className={className} />
}
