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
EXECUTE FUNCTION update_updated_at_column();
