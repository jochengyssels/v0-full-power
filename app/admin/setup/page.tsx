"use client"

import { useState } from "react"
import NavigationBar from "@/components/navigation-bar"
import Link from "next/link"

export default function SetupPage() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const sqlContent = document.getElementById("sql-content")?.textContent
    if (sqlContent) {
      navigator.clipboard.writeText(sqlContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
            <h1 className="text-2xl font-bold text-white mb-4">Database Setup Instructions</h1>
            <p className="text-white/80 mb-6">Follow these steps to set up your database tables in Supabase:</p>

            <ol className="space-y-6 text-white/80">
              <li className="bg-slate-700/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-2">1. Log in to your Supabase Dashboard</h2>
                <p>
                  Go to{" "}
                  <a
                    href="https://app.supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    https://app.supabase.com
                  </a>{" "}
                  and log in to your account.
                </p>
              </li>

              <li className="bg-slate-700/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-2">2. Open the SQL Editor</h2>
                <p>Select your project, then click on the "SQL Editor" tab in the left sidebar.</p>
              </li>

              <li className="bg-slate-700/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-2">3. Create a New Query</h2>
                <p>Click the "New Query" button and paste the following SQL code:</p>
                <div className="mt-4 relative">
                  <pre
                    id="sql-content"
                    className="bg-slate-900 p-4 rounded-lg text-white/80 text-sm overflow-auto max-h-96"
                  >
                    {`-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kite spots table (using kite_spots with underscore)
CREATE TABLE IF NOT EXISTS kite_spots (
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

-- Kitespot weather table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id UUID REFERENCES kite_spots(id) ON DELETE CASCADE,
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

-- Forecast data table
CREATE TABLE IF NOT EXISTS forecast_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kitespot_id UUID REFERENCES kite_spots(id) ON DELETE CASCADE,
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

-- Favorite spots table
CREATE TABLE IF NOT EXISTS favorite_spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  kitespot_id UUID REFERENCES kite_spots(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kitespot_id)
);

-- Kite sessions table
CREATE TABLE IF NOT EXISTS kite_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  kitespot_id UUID REFERENCES kite_spots(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  kite_size FLOAT,
  wind_speed FLOAT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_kitespots_updated_at ON kite_spots;
CREATE TRIGGER update_kitespots_updated_at
BEFORE UPDATE ON kite_spots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();`}
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </li>

              <li className="bg-slate-700/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-2">4. Run the Query</h2>
                <p>
                  Click the "Run" button to execute the SQL code. This will create all the necessary tables in your
                  database.
                </p>
              </li>

              <li className="bg-slate-700/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-2">5. Seed the Database</h2>
                <p>After creating the tables, you can seed the database with initial data by going to the seed page:</p>
                <div className="mt-4">
                  <Link
                    href="/admin/seed"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors inline-block"
                  >
                    Go to Seed Page
                  </Link>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}
