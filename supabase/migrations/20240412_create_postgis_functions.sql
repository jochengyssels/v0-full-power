-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create spatial index on kitespots table
CREATE INDEX IF NOT EXISTS kitespots_geom_idx ON kitespots USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Create a stored procedure for optimized geospatial queries
CREATE OR REPLACE FUNCTION get_kitespots_with_geospatial_data()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  country VARCHAR,
  location VARCHAR,
  latitude FLOAT,
  longitude FLOAT,
  difficulty VARCHAR,
  water_type VARCHAR,
  geom GEOMETRY,
  distance_from_equator FLOAT
) 
LANGUAGE SQL
AS $$
  SELECT 
    id,
    name,
    country,
    location,
    latitude,
    longitude,
    difficulty,
    water_type,
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) as geom,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
      ST_SetSRID(ST_MakePoint(0, 0), 4326)
    ) as distance_from_equator
  FROM 
    kitespots
  ORDER BY 
    name;
$$;

-- Create a function to find kitespots within a certain radius
CREATE OR REPLACE FUNCTION find_kitespots_within_radius(
  lat FLOAT,
  lng FLOAT,
  radius_km FLOAT
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  country VARCHAR,
  location VARCHAR,
  latitude FLOAT,
  longitude FLOAT,
  difficulty VARCHAR,
  water_type VARCHAR,
  distance_km FLOAT
) 
LANGUAGE SQL
AS $$
  SELECT 
    id,
    name,
    country,
    location,
    latitude,
    longitude,
    difficulty,
    water_type,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 as distance_km
  FROM 
    kitespots
  WHERE 
    ST_DWithin(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY 
    distance_km;
$$;
