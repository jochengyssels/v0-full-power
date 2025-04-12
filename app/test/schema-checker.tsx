"use client"

import { useState } from "react"
import { Loader2, Database, AlertTriangle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SchemaChecker() {
  const [loading, setLoading] = useState(false)
  const [schemaIssues, setSchemaIssues] = useState<any[]>([])
  const [checkedTables, setCheckedTables] = useState<string[]>([])

  // Expected schema for each table based on the provided schema
  const expectedSchema = {
    kitespots: [
      "id",
      "name",
      "description",
      "latitude",
      "longitude",
      "country",
      "location",
      "difficulty",
      "water_type",
      "created_at",
      "updated_at",
    ],
    weather_data: [
      "id",
      "spot_id",
      "timestamp",
      "temperature",
      "humidity",
      "precipitation",
      "wind_speed_10m",
      "wind_direction_10m",
      "cloud_cover",
      "visibility",
      "wind_gust",
      "weather_code",
      "is_day",
      "is_mock",
      "created_at",
    ],
    forecast_data: [
      "id",
      "spot_id",
      "forecast_time",
      "wind_speed",
      "wind_direction",
      "wind_gust",
      "temperature",
      "wave_height",
      "weather_code",
      "is_mock",
      "created_at",
    ],
    kiteschools: [
      "id",
      "company_name",
      "location",
      "country",
      "google_review_score",
      "owner_name",
      "website_url",
      "course_pricing",
      "logo_url",
      "created_at",
    ],
  }

  const checkSchema = async () => {
    setLoading(true)
    setSchemaIssues([])
    setCheckedTables([])

    try {
      // Get all tables in the public schema
      const { data: tables, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .order("table_name")

      if (tablesError) {
        throw new Error(`Error fetching tables: ${tablesError.message}`)
      }

      const issues = []
      const checked = []

      // Check each table against expected schema
      for (const table of tables || []) {
        const tableName = table.table_name
        checked.push(tableName)

        // Skip tables not in our expected schema
        if (!expectedSchema[tableName as keyof typeof expectedSchema]) {
          continue
        }

        // Get columns for this table
        const { data: columns, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select("column_name")
          .eq("table_schema", "public")
          .eq("table_name", tableName)

        if (columnsError) {
          issues.push({
            table: tableName,
            error: `Error fetching columns: ${columnsError.message}`,
            type: "error",
          })
          continue
        }

        // Get actual column names
        const actualColumns = columns?.map((col) => col.column_name) || []

        // Check for missing expected columns
        const expectedColumns = expectedSchema[tableName as keyof typeof expectedSchema]
        const missingColumns = expectedColumns.filter((col) => !actualColumns.includes(col))

        if (missingColumns.length > 0) {
          issues.push({
            table: tableName,
            missingColumns,
            type: "missing",
          })
        }

        // Check for extra columns that might cause issues
        const extraColumns = actualColumns.filter((col) => !expectedColumns.includes(col))
        if (extraColumns.length > 0) {
          issues.push({
            table: tableName,
            extraColumns,
            type: "extra",
          })
        }
      }

      setSchemaIssues(issues)
      setCheckedTables(checked)
    } catch (error) {
      console.error("Error checking schema:", error)
      setSchemaIssues([
        {
          error: String(error),
          type: "error",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Schema Compatibility Checker</h3>
        <button
          onClick={checkSchema}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md shadow-md transition-colors disabled:opacity-70 flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Checking...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Check Schema Compatibility
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <span className="ml-2 text-white">Analyzing database schema...</span>
        </div>
      )}

      {!loading && checkedTables.length > 0 && (
        <div className="mb-4 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-white">
            Checked {checkedTables.length} tables: {checkedTables.join(", ")}
          </p>
        </div>
      )}

      {!loading && schemaIssues.length === 0 && checkedTables.length > 0 && (
        <div className="p-4 bg-green-900/20 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
          <div>
            <p className="text-white font-medium">Schema looks good!</p>
            <p className="text-white/70 text-sm mt-1">
              No compatibility issues were found between your database schema and the application's expectations.
            </p>
          </div>
        </div>
      )}

      {!loading && schemaIssues.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-900/20 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
            <div>
              <p className="text-white font-medium">Schema compatibility issues detected</p>
              <p className="text-white/70 text-sm mt-1">
                The following issues might cause errors in your application. Consider updating your database schema or
                modifying the application code.
              </p>
            </div>
          </div>

          {schemaIssues.map((issue, index) => (
            <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
              {issue.table && <h4 className="text-lg font-medium text-white mb-2">Table: {issue.table}</h4>}

              {issue.type === "error" && <p className="text-red-400">{issue.error}</p>}

              {issue.type === "missing" && issue.missingColumns && (
                <div>
                  <p className="text-amber-400 mb-1">Missing columns that the application expects:</p>
                  <ul className="list-disc list-inside text-white/80 pl-2">
                    {issue.missingColumns.map((col: string) => (
                      <li key={col}>{col}</li>
                    ))}
                  </ul>
                </div>
              )}

              {issue.type === "extra" && issue.extraColumns && (
                <div>
                  <p className="text-blue-400 mb-1">Extra columns not expected by the application:</p>
                  <ul className="list-disc list-inside text-white/80 pl-2">
                    {issue.extraColumns.map((col: string) => (
                      <li key={col}>{col}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
