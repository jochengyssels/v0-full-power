"use client"

import { useState } from "react"
import { seedAllData } from "@/lib/seed-data"
import NavigationBar from "@/components/navigation-bar"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setLoading(true)
    setError(null)

    try {
      const seedResult = await seedAllData()
      setResult(seedResult)
    } catch (err) {
      console.error("Error seeding database:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10 max-w-xl w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Database Seed Utility</h1>
          <p className="text-white/80 mb-6">
            This utility will seed your Supabase database with initial data if it doesn't already exist.
          </p>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center justify-center w-full"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Seeding Database...
              </>
            ) : (
              "Seed Database"
            )}
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600/30`}>
              <h2 className="text-lg font-semibold text-white mb-2">Seed Results</h2>
              <div className="space-y-4">
                <div
                  className={`p-3 rounded-lg ${result.kiteSpots.success ? "bg-green-900/20 border border-green-800/30" : "bg-red-900/20 border border-red-800/30"}`}
                >
                  <h3 className="font-medium text-white">Kite Spots</h3>
                  <p className="text-white/80 text-sm">
                    {result.kiteSpots.success ? "Successfully seeded" : "Error: " + result.kiteSpots.error}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg ${result.kiteSchools.success ? "bg-green-900/20 border border-green-800/30" : "bg-red-900/20 border border-red-800/30"}`}
                >
                  <h3 className="font-medium text-white">Kite Schools</h3>
                  <p className="text-white/80 text-sm">
                    {result.kiteSchools.success ? "Successfully seeded" : "Error: " + result.kiteSchools.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-2">Error</h2>
              <p className="text-white/80">{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
