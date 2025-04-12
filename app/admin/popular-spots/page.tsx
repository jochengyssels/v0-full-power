"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import NavigationBar from "@/components/navigation-bar"
import { Loader2, MapPin, Wind, Users, RefreshCw } from "lucide-react"

export default function PopularSpotsPage() {
  const [popularSpots, setPopularSpots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPopularSpots = async () => {
    try {
      setLoading(true)
      setError(null)

      // Query the spot_interactions table to get counts by kitespot
      const { data, error } = await supabase.rpc("get_popular_spots")

      if (error) {
        throw error
      }

      setPopularSpots(data || [])
    } catch (err) {
      console.error("Error fetching popular spots:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  // Create the stored procedure if it doesn't exist
  const createStoredProcedure = async () => {
    try {
      await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE OR REPLACE FUNCTION get_popular_spots()
          RETURNS TABLE (
            id UUID,
            name TEXT,
            country TEXT,
            location TEXT,
            latitude FLOAT,
            longitude FLOAT,
            interaction_count BIGINT,
            search_count BIGINT,
            click_count BIGINT
          )
          LANGUAGE SQL
          AS $$
            SELECT 
              k.id,
              k.name,
              k.country,
              k.location,
              k.latitude,
              k.longitude,
              COUNT(si.id) as interaction_count,
              COUNT(CASE WHEN si.interaction_type = 'search' THEN 1 END) as search_count,
              COUNT(CASE WHEN si.interaction_type = 'click' THEN 1 END) as click_count
            FROM 
              kitespots k
            LEFT JOIN 
              spot_interactions si ON k.id = si.kitespot_id
            GROUP BY 
              k.id, k.name, k.country, k.location, k.latitude, k.longitude
            ORDER BY 
              interaction_count DESC;
          $$;
        `,
      })
    } catch (err) {
      console.error("Error creating stored procedure:", err)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchPopularSpots()
    setRefreshing(false)
  }

  useEffect(() => {
    const initialize = async () => {
      await createStoredProcedure()
      await fetchPopularSpots()
    }

    initialize()
  }, [])

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Popular Kite Spots</h1>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
                <span className="ml-2 text-white">Loading popular spots data...</span>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-white">
                <p className="font-medium">Error loading data:</p>
                <p className="mt-1 text-white/80">{error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-full mr-3">
                      <MapPin className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Spots</p>
                      <p className="text-2xl font-bold text-white">{popularSpots.length}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 flex items-center">
                    <div className="bg-green-500/20 p-3 rounded-full mr-3">
                      <Wind className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Searches</p>
                      <p className="text-2xl font-bold text-white">
                        {popularSpots.reduce((sum, spot) => sum + (spot.search_count || 0), 0)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 flex items-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mr-3">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Clicks</p>
                      <p className="text-2xl font-bold text-white">
                        {popularSpots.reduce((sum, spot) => sum + (spot.click_count || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-medium">Rank</th>
                        <th className="px-4 py-3 text-left text-white font-medium">Spot Name</th>
                        <th className="px-4 py-3 text-left text-white font-medium">Location</th>
                        <th className="px-4 py-3 text-right text-white font-medium">Searches</th>
                        <th className="px-4 py-3 text-right text-white font-medium">Clicks</th>
                        <th className="px-4 py-3 text-right text-white font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularSpots.map((spot, index) => (
                        <tr
                          key={spot.id}
                          className={`
                            ${index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"}
                            ${index < 3 ? "border-l-4" : ""}
                            ${index === 0 ? "border-yellow-400" : index === 1 ? "border-gray-400" : index === 2 ? "border-amber-700" : ""}
                          `}
                        >
                          <td className="px-4 py-3 text-white font-medium">
                            {index + 1}
                            {index < 3 && (
                              <span className="ml-2">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-white">{spot.name}</td>
                          <td className="px-4 py-3 text-white/70">
                            {spot.country}, {spot.location}
                          </td>
                          <td className="px-4 py-3 text-right text-white/90">{spot.search_count || 0}</td>
                          <td className="px-4 py-3 text-right text-white/90">{spot.click_count || 0}</td>
                          <td className="px-4 py-3 text-right font-medium text-white">{spot.interaction_count || 0}</td>
                        </tr>
                      ))}

                      {popularSpots.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-white/60">
                            No interaction data recorded yet. Try searching for or clicking on kite spots.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
