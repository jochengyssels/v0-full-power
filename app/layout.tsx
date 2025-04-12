import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "@/styles/mapbox.css"

export const metadata: Metadata = {
  title: "Full Power - Kitesurfing Spots",
  description: "Explore the world's best kitesurfing spots with data-rich insights",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'