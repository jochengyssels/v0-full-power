"use client"

import { useState } from "react"
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConnectionTester() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [details, setDetails] = useState<any>(null)
  const [dbSchema, setDbSchema] = useState<any[]>([])
  const [loadingSchema, setLoadingSchema] = useState(false)

  const checkConnection = async () => {
    setStatus("loading")
    setMessage("Checking connection to Supabase...")

    try {
      // Test the connection by making a simple query
      const { data, error } = await supabase.from("kite_spots").select("count").limit(1).single()

      if (error) {
        setStatus("error")
        setMessage(`Error connecting to Supabase: ${error.message}`)
        setDetails({ error: error })
      } else {
        setStatus("success")
        setMessage("Successfully connected to Supabase!")
        setDetails({ data })
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Error checking connection: ${error instanceof Error ? error.message : String(error)}`)
      setDetails({ error: String(error) })
    }
  }

  const fetchDatabaseSchema = async () => {
    setLoadingSchema(true)
    try {
      // Fetch tables
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .order("table_name")

      if (tablesError) {
        throw new Error(`Error fetching tables: ${tablesError.message}`)
      }

      const tables = tablesData || []
      const schema = []

      // For each table, fetch its columns
      for (const table of tables) {
        const { data: columnsData, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select("column_name, data_type, is_nullable, column_default")
          .eq("table_schema", "public")
          .eq("table_name", table.table_name)
          .order("ordinal_position")

        if (columnsError) {
          console.error(`Error fetching columns for ${table.table_name}:`, columnsError)
          continue
        }

        schema.push({
          table_name: table.table_name,
          columns: columnsData || [],
        })
      }

      setDbSchema(schema)
    } catch (error) {
      console.error("Error fetching database schema:", error)
      setDbSchema([])
    } finally {
      setLoadingSchema(false)
    }
  }

  return (
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">Supabase Connection Tester</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <button
            onClick={checkConnection}
            disabled={status === "loading"}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md shadow-md transition-colors disabled:opacity-70 flex items-center w-full justify-center"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              "Test Supabase Connection"
            )}
          </button>
        </div>

        <div>
          <button
            onClick={fetchDatabaseSchema}
            disabled={loadingSchema}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md transition-colors disabled:opacity-70 flex items-center w-full justify-center"
          >
            {loadingSchema ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading Schema...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Fetch Database Schema
              </>
            )}
          </button>
        </div>
      </div>

      {status !== "idle" && (
        <div
          className={`p-4 rounded-md mb-6 ${
            status === "loading" ? "bg-slate-700/50" : status === "success" ? "bg-green-900/20" : "bg-red-900/20"
          }`}
        >
          <div className="flex items-start">
            {status === "loading" && <Loader2 className="h-5 w-5 text-white animate-spin mr-2 mt-0.5" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />}
            {status === "error" && <XCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />}
            <div>
              <p className="text-white font-medium">{message}</p>

              {details && status === "success" && (
                <div className="mt-2 text-sm">
                  <p className="text-white/70">Connection successful! Your database is ready.</p>
                </div>
              )}

              {details && status === "error" && (
                <div className="mt-2 p-3 bg-slate-800/50 rounded text-white/60 text-xs overflow-auto max-h-40">
                  <pre>{JSON.stringify(details, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-4 bg-amber-900/20 rounded-md mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
            <div>
              <p className="text-white font-medium">Troubleshooting Tips:</p>
              <ul className="mt-2 text-white/70 text-sm space-y-2">
                <li>• Check that your Supabase URL and API key are correctly set in your environment variables</li>
                <li>• Verify that your Supabase project is active and running</li>
                <li>• Ensure your database tables have been created using the setup utility</li>
                <li>• Check if there are any network restrictions or firewall issues</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {dbSchema.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Database Schema</h3>
          <div className="space-y-6">
            {dbSchema.map((table) => (
              <div key={table.table_name} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-emerald-400" />
                  {table.table_name}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-white/80">
                    <thead className="text-xs uppercase bg-slate-800/50 text-white/60">
                      <tr>
                        <th className="px-4 py-2 rounded-tl-lg">Column Name</th>
                        <th className="px-4 py-2">Data Type</th>
                        <th className="px-4 py-2">Nullable</th>
                        <th className="px-4 py-2 rounded-tr-lg">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((column: any, index: number) => (
                        <tr
                          key={column.column_name}
                          className={index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"}
                        >
                          <td className="px-4 py-2 font-medium">{column.column_name}</td>
                          <td className="px-4 py-2">{column.data_type}</td>
                          <td className="px-4 py-2">{column.is_nullable === "YES" ? "Yes" : "No"}</td>
                          <td className="px-4 py-2">{column.column_default || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loadingSchema && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <span className="ml-2 text-white">Loading database schema...</span>
        </div>
      )}
    </div>
  )
}
