import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Setting up database tables...")

    // Execute the SQL schema to create tables
    const { error: usersTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          hashed_password VARCHAR(255) NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (usersTableError) {
      console.error("Error creating users table:", usersTableError)
      return NextResponse.json({ error: "Failed to create users table", details: usersTableError }, { status: 500 })
    }

    const { error: kiteSpotsTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Kite spots table
        CREATE TABLE IF NOT EXISTS kitespots (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          latitude FLOAT NOT NULL,
          longitude FLOAT NOT NULL,
          country VARCHAR(255),
          region VARCHAR(255),
          city VARCHAR(255),
          difficulty VARCHAR(50),
          water_type VARCHAR(50),
          best_wind_direction VARCHAR(50),
          best_season VARCHAR(100),
          color VARCHAR(20) DEFAULT '#3a7cc3',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (kiteSpotsTableError) {
      console.error("Error creating kitespots table:", kiteSpotsTableError)
      return NextResponse.json(
        { error: "Failed to create kitespots table", details: kiteSpotsTableError },
        { status: 500 },
      )
    }

    const { error: weatherDataTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Kitespot weather table
        CREATE TABLE IF NOT EXISTS weather_data (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          spot_id UUID REFERENCES kitespots(id) ON DELETE CASCADE,
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
          temperature FLOAT,
          humidity FLOAT,
          precipitation FLOAT,
          wind_speed_10m FLOAT,
          wind_direction_10m FLOAT,
          cloud_cover FLOAT,
          visibility FLOAT,
          is_mock BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (weatherDataTableError) {
      console.error("Error creating weather_data table:", weatherDataTableError)
      return NextResponse.json(
        { error: "Failed to create weather_data table", details: weatherDataTableError },
        { status: 500 },
      )
    }

    const { error: forecastDataTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Forecast data table
        CREATE TABLE IF NOT EXISTS forecast_data (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          kitespot_id UUID REFERENCES kitespots(id) ON DELETE CASCADE,
          forecast_time TIMESTAMP WITH TIME ZONE NOT NULL,
          wind_speed FLOAT,
          wind_direction FLOAT,
          wind_gust FLOAT,
          temperature FLOAT,
          humidity FLOAT,
          precipitation FLOAT,
          cloud_cover FLOAT,
          visibility FLOAT,
          weather_code INTEGER,
          is_mock BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (forecastDataTableError) {
      console.error("Error creating forecast_data table:", forecastDataTableError)
      return NextResponse.json(
        { error: "Failed to create forecast_data table", details: forecastDataTableError },
        { status: 500 },
      )
    }

    const { error: favoritesSpotsTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Favorite spots table
        CREATE TABLE IF NOT EXISTS favorite_spots (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          kitespot_id UUID REFERENCES kitespots(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, kitespot_id)
        );
      `,
    })

    if (favoritesSpotsTableError) {
      console.error("Error creating favorite_spots table:", favoritesSpotsTableError)
      return NextResponse.json(
        { error: "Failed to create favorite_spots table", details: favoritesSpotsTableError },
        { status: 500 },
      )
    }

    const { error: kiteSessionsTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Kite sessions table
        CREATE TABLE IF NOT EXISTS kite_sessions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          kitespot_id UUID REFERENCES kitespots(id) ON DELETE CASCADE,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          duration_minutes INTEGER,
          kite_size FLOAT,
          wind_speed FLOAT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (kiteSessionsTableError) {
      console.error("Error creating kite_sessions table:", kiteSessionsTableError)
      return NextResponse.json(
        { error: "Failed to create kite_sessions table", details: kiteSessionsTableError },
        { status: 500 },
      )
    }

    const { error: kiteschoolsTableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Kiteschools table
        CREATE TABLE IF NOT EXISTS kiteschools (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          country VARCHAR(255) NOT NULL,
          google_review_score VARCHAR(50),
          owner_name VARCHAR(255),
          website_url VARCHAR(255),
          course_pricing VARCHAR(255),
          logo_url VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (kiteschoolsTableError) {
      console.error("Error creating kiteschools table:", kiteschoolsTableError)
      return NextResponse.json(
        { error: "Failed to create kiteschools table", details: kiteschoolsTableError },
        { status: 500 },
      )
    }

    const { error: triggerFunctionError } = await supabase.rpc("execute_sql", {
      sql_query: `
        -- Create a function to update the updated_at column
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger to automatically update updated_at
        DROP TRIGGER IF EXISTS update_kitespots_updated_at ON kitespots;
        CREATE TRIGGER update_kitespots_updated_at
        BEFORE UPDATE ON kitespots
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `,
    })

    if (triggerFunctionError) {
      console.error("Error creating trigger function:", triggerFunctionError)
      return NextResponse.json(
        { error: "Failed to create trigger function", details: triggerFunctionError },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully",
    })
  } catch (error) {
    console.error("Unexpected error setting up database:", error)
    return NextResponse.json(
      {
        error: "Failed to set up database",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
