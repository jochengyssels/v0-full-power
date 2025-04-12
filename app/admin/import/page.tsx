"use client"

import { useState } from "react"
import NavigationBar from "@/components/navigation-bar"
import { Loader2 } from "lucide-react"

export default function ImportCsvPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Default URLs from the user's request
  const defaultKitespotsUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitespots-kIfAQ5T4XqD1do733CjL6Pi87pvQdB.csv"
  const defaultKiteschoolsUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kiteschools-721V8aaP1hUm0JA09SuDSw4YuPWRZT.csv"

  const [kitespotsUrl, setKitespotsUrl] = useState(defaultKitespotsUrl)
  const [kiteschoolsUrl, setKiteschoolsUrl] = useState(defaultKiteschoolsUrl)

  const handleImport = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/import-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kitespotsUrl,
          kiteschoolsUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to import CSV data")
      }
    } catch (err) {
      console.error("Error importing CSV data:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
            <h1 className="text-2xl font-bold text-white mb-4">Import CSV Data</h1>
            <p className="text-white/80 mb-6">
              Import kitespots and kiteschools data from CSV files into your Supabase database.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="kitespotsUrl" className="block text-white font-medium mb-2">
                  Kitespots CSV URL
                </label>
                <input
                  type="text"
                  id="kitespotsUrl"
                  value={kitespotsUrl}
                  onChange={(e) => setKitespotsUrl(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label htmlFor="kiteschoolsUrl" className="block text-white font-medium mb-2">
                  Kiteschools CSV URL
                </label>
                <input
                  type="text"
                  id="kiteschoolsUrl"
                  value={kiteschoolsUrl}
                  onChange={(e) => setKiteschoolsUrl(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <button
              onClick={handleImport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center justify-center w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Importing Data...
                </>
              ) : (
                "Import CSV Data"
              )}
            </button>

            {result && (
              <div className="mt-6 space-y-4">
                <div
                  className={`p-4 rounded-lg ${result.kiteSpots.success ? "bg-green-900/20 border border-green-800/30" : "bg-red-900/20 border border-red-800/30"}`}
                >
                  <h3 className="font-medium text-white">Kite Spots Import</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {result.kiteSpots.message ||
                      (result.kiteSpots.success ? "Successfully imported" : "Error: " + result.kiteSpots.error)}
                  </p>
                  {result.kiteSpots.insertedCount && (
                    <p className="text-white/80 text-sm mt-1">Inserted {result.kiteSpots.insertedCount} records</p>
                  )}
                </div>

                <div
                  className={`p-4 rounded-lg ${result.kiteSchools.success ? "bg-green-900/20 border border-green-800/30" : "bg-red-900/20 border border-red-800/30"}`}
                >
                  <h3 className="font-medium text-white">Kite Schools Import</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {result.kiteSchools.message ||
                      (result.kiteSchools.success ? "Successfully imported" : "Error: " + result.kiteSchools.error)}
                  </p>
                  {result.kiteSchools.insertedCount && (
                    <p className="text-white/80 text-sm mt-1">Inserted {result.kiteSchools.insertedCount} records</p>
                  )}
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
      </div>
    </>
  )
}
