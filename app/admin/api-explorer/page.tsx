"use client"

import { useState, useEffect } from "react"
import NavigationBar from "@/components/navigation-bar"
import { Loader2, ChevronDown, ChevronRight, Database, Table, Eye, Play, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { supabase } from "@/lib/supabase"

export default function ApiExplorerPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schema, setSchema] = useState<any[]>([])
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({})
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({})
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [testLoading, setTestLoading] = useState<Record<string, boolean>>({})
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchDatabaseSchema()
  }, [])

  const fetchDatabaseSchema = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use our API endpoint to fetch the schema
      const response = await fetch("/api/schema")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to fetch schema: ${response.status}`)
      }

      const data = await response.json()

      if (data.schema) {
        setSchema(data.schema)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        // Fallback to hardcoded schema if API doesn't return expected data
        setSchema(getHardcodedSchema())
      }
    } catch (err) {
      console.error("Error fetching database schema:", err)
      setError(err instanceof Error ? err.message : String(err))

      // Fallback to hardcoded schema
      setSchema(getHardcodedSchema())
    } finally {
      setLoading(false)
    }
  }

  // Fallback function to get a hardcoded schema
  const getHardcodedSchema = () => {
    return [
      {
        table_name: "kitespots",
        table_type: "BASE TABLE",
        columns: [
          { column_name: "id", data_type: "uuid", is_nullable: "NO", column_default: null },
          { column_name: "name", data_type: "character varying", is_nullable: "NO", column_default: null },
          { column_name: "description", data_type: "text", is_nullable: "YES", column_default: null },
          { column_name: "latitude", data_type: "double precision", is_nullable: "NO", column_default: null },
          { column_name: "longitude", data_type: "double precision", is_nullable: "NO", column_default: null },
          { column_name: "country", data_type: "character varying", is_nullable: "YES", column_default: null },
          { column_name: "location", data_type: "character varying", is_nullable: "YES", column_default: null },
          { column_name: "difficulty", data_type: "character varying", is_nullable: "YES", column_default: null },
          { column_name: "water_type", data_type: "character varying", is_nullable: "YES", column_default: null },
          {
            column_name: "created_at",
            data_type: "timestamp with time zone",
            is_nullable: "YES",
            column_default: "now()",
          },
          {
            column_name: "updated_at",
            data_type: "timestamp with time zone",
            is_nullable: "YES",
            column_default: "now()",
          },
        ],
        primary_keys: ["id"],
      },
      {
        table_name: "kiteschools",
        table_type: "BASE TABLE",
        columns: [
          { column_name: "id", data_type: "uuid", is_nullable: "NO", column_default: null },
          { column_name: "company_name", data_type: "character varying", is_nullable: "NO", column_default: null },
          { column_name: "location", data_type: "character varying", is_nullable: "NO", column_default: null },
          { column_name: "country", data_type: "character varying", is_nullable: "NO", column_default: null },
          {
            column_name: "google_review_score",
            data_type: "character varying",
            is_nullable: "YES",
            column_default: null,
          },
          { column_name: "owner_name", data_type: "character varying", is_nullable: "YES", column_default: null },
          { column_name: "website_url", data_type: "character varying", is_nullable: "YES", column_default: null },
          { column_name: "course_pricing", data_type: "character varying", is_nullable: "YES", column_default: null },
          { column_name: "logo_url", data_type: "character varying", is_nullable: "YES", column_default: null },
          {
            column_name: "created_at",
            data_type: "timestamp with time zone",
            is_nullable: "YES",
            column_default: "now()",
          },
        ],
        primary_keys: ["id"],
      },
    ]
  }

  const toggleTableExpanded = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }))
  }

  const toggleEndpointExpanded = (endpointId: string) => {
    setExpandedEndpoints((prev) => ({
      ...prev,
      [endpointId]: !prev[endpointId],
    }))
  }

  const testEndpoint = async (tableName: string, method: string) => {
    const endpointId = `${tableName}-${method}`

    try {
      setTestLoading((prev) => ({ ...prev, [endpointId]: true }))

      // Only implement GET for safety
      if (method === "GET") {
        const { data, error } = await supabase.from(tableName).select("*").limit(5)

        if (error) throw error

        setTestResults((prev) => ({
          ...prev,
          [endpointId]: { data, status: 200 },
        }))
      }
    } catch (err) {
      console.error(`Error testing ${method} endpoint for ${tableName}:`, err)
      setTestResults((prev) => ({
        ...prev,
        [endpointId]: {
          error: err instanceof Error ? err.message : String(err),
          status: 500,
        },
      }))
    } finally {
      setTestLoading((prev) => ({ ...prev, [endpointId]: false }))
    }
  }

  const copyToClipboard = (text: string, type: "endpoint" | "code", id: string) => {
    navigator.clipboard.writeText(text)
    if (type === "endpoint") {
      setCopiedEndpoint(id)
      setTimeout(() => setCopiedEndpoint(null), 2000)
    } else {
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    }
  }

  const getEndpointUrl = (tableName: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${tableName}`
  }

  const getCodeSnippet = (tableName: string, method: string) => {
    switch (method) {
      case "GET":
        return `// Fetch all records from ${tableName}
const { data, error } = await supabase
  .from('${tableName}')
  .select('*')
  .limit(10)

if (error) console.error(error)
else console.log(data)`

      case "POST":
        return `// Insert a new record into ${tableName}
const newRecord = {
  // Add your fields here
}

const { data, error } = await supabase
  .from('${tableName}')
  .insert([newRecord])
  .select()

if (error) console.error(error)
else console.log('Record inserted:', data)`

      case "PATCH":
        return `// Update a record in ${tableName}
const updates = {
  // Add your fields to update here
}

const { data, error } = await supabase
  .from('${tableName}')
  .update(updates)
  .eq('id', 'your-record-id') // Replace with your primary key
  .select()

if (error) console.error(error)
else console.log('Record updated:', data)`

      case "DELETE":
        return `// Delete a record from ${tableName}
const { error } = await supabase
  .from('${tableName}')
  .delete()
  .eq('id', 'your-record-id') // Replace with your primary key

if (error) console.error(error)
else console.log('Record deleted successfully')`

      default:
        return ""
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-600 hover:bg-green-700"
      case "POST":
        return "bg-blue-600 hover:bg-blue-700"
      case "PATCH":
        return "bg-amber-600 hover:bg-amber-700"
      case "DELETE":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Supabase API Explorer</h1>
                <p className="text-white/70 mt-1">Browse and test your Supabase database APIs</p>
              </div>
              <button
                onClick={fetchDatabaseSchema}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Refresh Schema
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
                <span className="ml-2 text-white">Loading database schema...</span>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-white">
                <p className="font-medium">Error loading schema:</p>
                <p className="mt-1 text-white/80">{error}</p>
                <p className="mt-4 text-white/80">Using fallback schema data instead.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-white mb-2">
                    <Database className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="font-medium">Database Schema</span>
                    <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                      {schema.length} Tables/Views
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">
                    This explorer shows all tables and views in your Supabase database and their corresponding REST API
                    endpoints. Click on a table to see its schema and available endpoints.
                  </p>
                </div>

                {schema.map((table) => (
                  <div
                    key={table.table_name}
                    className="bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600/30"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                      onClick={() => toggleTableExpanded(table.table_name)}
                    >
                      <div className="flex items-center">
                        {table.table_type === "BASE TABLE" ? (
                          <Table className="h-5 w-5 mr-2 text-blue-400" />
                        ) : (
                          <Eye className="h-5 w-5 mr-2 text-purple-400" />
                        )}
                        <span className="font-medium text-white">{table.table_name}</span>
                        <span className="ml-2 bg-slate-600/50 text-white/70 px-2 py-0.5 rounded-full text-xs">
                          {table.table_type === "BASE TABLE" ? "Table" : "View"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/70 text-sm mr-2">{table.columns.length} columns</span>
                        {expandedTables[table.table_name] ? (
                          <ChevronDown className="h-5 w-5 text-white/70" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-white/70" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedTables[table.table_name] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="border-t border-slate-600/30 p-4">
                            <h3 className="text-white font-medium mb-3">Schema</h3>
                            <div className="bg-slate-800/50 rounded-lg overflow-hidden mb-6">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-slate-800/80">
                                    <th className="px-4 py-2 text-left text-white/70 font-medium">Column</th>
                                    <th className="px-4 py-2 text-left text-white/70 font-medium">Type</th>
                                    <th className="px-4 py-2 text-left text-white/70 font-medium">Nullable</th>
                                    <th className="px-4 py-2 text-left text-white/70 font-medium">Default</th>
                                    <th className="px-4 py-2 text-left text-white/70 font-medium">Primary Key</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.columns.map((column: any, index: number) => (
                                    <tr
                                      key={column.column_name}
                                      className={index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/10"}
                                    >
                                      <td className="px-4 py-2 text-white font-medium">{column.column_name}</td>
                                      <td className="px-4 py-2 text-white/80">{column.data_type}</td>
                                      <td className="px-4 py-2">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-xs ${
                                            column.is_nullable === "YES"
                                              ? "bg-amber-500/20 text-amber-300"
                                              : "bg-red-500/20 text-red-300"
                                          }`}
                                        >
                                          {column.is_nullable === "YES" ? "YES" : "NO"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 text-white/80">
                                        {column.column_default || <span className="text-white/40">null</span>}
                                      </td>
                                      <td className="px-4 py-2">
                                        {table.primary_keys.includes(column.column_name) ? (
                                          <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                                            Primary Key
                                          </span>
                                        ) : (
                                          <span className="text-white/40">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <h3 className="text-white font-medium mb-3">API Endpoints</h3>
                            <div className="space-y-3">
                              {["GET", "POST", "PATCH", "DELETE"].map((method) => {
                                const endpointId = `${table.table_name}-${method}`
                                return (
                                  <div key={endpointId} className="bg-slate-800/50 rounded-lg overflow-hidden">
                                    <div
                                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                                      onClick={() => toggleEndpointExpanded(endpointId)}
                                    >
                                      <div className="flex items-center">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium text-white ${getMethodColor(method)}`}
                                        >
                                          {method}
                                        </span>
                                        <span className="ml-3 text-white/80">{getEndpointUrl(table.table_name)}</span>
                                      </div>
                                      <div className="flex items-center">
                                        {method === "GET" && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              testEndpoint(table.table_name, method)
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium mr-2 flex items-center"
                                            disabled={testLoading[endpointId]}
                                          >
                                            {testLoading[endpointId] ? (
                                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            ) : (
                                              <Play className="h-3 w-3 mr-1" />
                                            )}
                                            Try it
                                          </button>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            copyToClipboard(getEndpointUrl(table.table_name), "endpoint", endpointId)
                                          }}
                                          className="text-white/70 hover:text-white p-1 rounded"
                                        >
                                          {copiedEndpoint === endpointId ? (
                                            <Check className="h-4 w-4 text-green-400" />
                                          ) : (
                                            <Copy className="h-4 w-4" />
                                          )}
                                        </button>
                                        {expandedEndpoints[endpointId] ? (
                                          <ChevronDown className="h-5 w-5 text-white/70 ml-2" />
                                        ) : (
                                          <ChevronRight className="h-5 w-5 text-white/70 ml-2" />
                                        )}
                                      </div>
                                    </div>

                                    <AnimatePresence>
                                      {expandedEndpoints[endpointId] && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <div className="border-t border-slate-600/30 p-4">
                                            <div className="mb-4">
                                              <h4 className="text-white/80 text-sm font-medium mb-2">Description</h4>
                                              <p className="text-white/70 text-sm">
                                                {method === "GET" &&
                                                  `Retrieve records from the ${table.table_name} table.`}
                                                {method === "POST" &&
                                                  `Insert new records into the ${table.table_name} table.`}
                                                {method === "PATCH" &&
                                                  `Update existing records in the ${table.table_name} table.`}
                                                {method === "DELETE" &&
                                                  `Delete records from the ${table.table_name} table.`}
                                              </p>
                                            </div>

                                            <div className="mb-4">
                                              <h4 className="text-white/80 text-sm font-medium mb-2">Parameters</h4>
                                              <div className="bg-slate-800/80 rounded-lg p-3">
                                                {method === "GET" && (
                                                  <div className="space-y-2">
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        select
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          Comma-separated list of columns to return
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">
                                                          Example: id,name,created_at
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        limit
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          Maximum number of rows to return
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">Example: 10</div>
                                                      </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        offset
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          Number of rows to skip
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">Example: 0</div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                                {method === "POST" && (
                                                  <div className="space-y-2">
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        Body
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          JSON object or array of objects to insert
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">Required</div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                                {method === "PATCH" && (
                                                  <div className="space-y-2">
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        Body
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          JSON object with fields to update
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">Required</div>
                                                      </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        Filter
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          Query parameters to filter records to update
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">
                                                          Example: ?id=eq.123
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                                {method === "DELETE" && (
                                                  <div className="space-y-2">
                                                    <div className="flex items-start">
                                                      <span className="text-white/80 text-sm font-medium w-24">
                                                        Filter
                                                      </span>
                                                      <div>
                                                        <span className="text-white/70 text-sm">
                                                          Query parameters to filter records to delete
                                                        </span>
                                                        <div className="text-white/50 text-xs mt-1">
                                                          Example: ?id=eq.123
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            <div className="mb-4">
                                              <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white/80 text-sm font-medium">Code Example</h4>
                                                <button
                                                  onClick={() =>
                                                    copyToClipboard(
                                                      getCodeSnippet(table.table_name, method),
                                                      "code",
                                                      endpointId,
                                                    )
                                                  }
                                                  className="text-white/70 hover:text-white p-1 rounded flex items-center text-xs"
                                                >
                                                  {copiedCode === endpointId ? (
                                                    <>
                                                      <Check className="h-3 w-3 text-green-400 mr-1" />
                                                      Copied!
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Copy className="h-3 w-3 mr-1" />
                                                      Copy
                                                    </>
                                                  )}
                                                </button>
                                              </div>
                                              <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                                                <pre className="text-white/80 text-sm font-mono">
                                                  {getCodeSnippet(table.table_name, method)}
                                                </pre>
                                              </div>
                                            </div>

                                            {testResults[endpointId] && (
                                              <div>
                                                <h4 className="text-white/80 text-sm font-medium mb-2">Response</h4>
                                                <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto max-h-60">
                                                  <pre className="text-white/80 text-sm font-mono">
                                                    {JSON.stringify(testResults[endpointId], null, 2)}
                                                  </pre>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
