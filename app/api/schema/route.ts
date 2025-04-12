import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch tables
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables")

    if (tablesError) {
      // If the RPC function doesn't exist, fall back to a direct query
      const { data: fallbackTables, error: fallbackError } = await supabase
        .from("kitespots")
        .select("id")
        .limit(1)
        .then(() => {
          // If we can query kitespots, return a hardcoded list of known tables
          return {
            data: [
              { table_name: "kitespots", table_type: "BASE TABLE" },
              { table_name: "kiteschools", table_type: "BASE TABLE" },
              { table_name: "weather_data", table_type: "BASE TABLE" },
              { table_name: "forecast_data", table_type: "BASE TABLE" },
              { table_name: "favorite_spots", table_type: "BASE TABLE" },
              { table_name: "kite_sessions", table_type: "BASE TABLE" },
              { table_name: "spot_interactions", table_type: "BASE TABLE" },
            ],
            error: null,
          }
        })
        .catch((err) => {
          return { data: null, error: err }
        })

      if (fallbackError) {
        return NextResponse.json({ error: `Failed to fetch tables: ${fallbackError.message}` }, { status: 500 })
      }

      return NextResponse.json({ tables: fallbackTables })
    }

    // Process each table to get its columns
    const schemaData = []

    for (const table of tables) {
      // Get columns for this table
      const { data: columns, error: columnsError } = await supabase.from(table.table_name).select("*").limit(1)

      if (columnsError) {
        console.error(`Error fetching columns for ${table.table_name}:`, columnsError)
        continue
      }

      // Extract column names and types from the first row
      const columnInfo =
        columns && columns.length > 0
          ? Object.keys(columns[0]).map((column_name) => ({
              column_name,
              data_type: typeof columns[0][column_name],
              is_nullable: "YES", // We don't know this from the data
              column_default: null, // We don't know this from the data
            }))
          : []

      // Assume 'id' is the primary key if it exists
      const primaryKeys = columnInfo.filter((col) => col.column_name === "id").map((col) => col.column_name)

      schemaData.push({
        table_name: table.table_name,
        table_type: table.table_type,
        columns: columnInfo,
        primary_keys: primaryKeys,
      })
    }

    return NextResponse.json({ schema: schemaData })
  } catch (error) {
    console.error("Error fetching schema:", error)
    return NextResponse.json(
      { error: `Failed to fetch schema: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
