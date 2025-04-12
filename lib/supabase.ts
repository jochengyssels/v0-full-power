import { createClient } from "@supabase/supabase-js"

// These environment variables are automatically available in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for the server
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a singleton client for the browser to avoid multiple instances
let browserSupabase: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!browserSupabase && typeof window !== "undefined") {
    browserSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return browserSupabase
}

// Create a server-side client (for use in Server Components and API routes)
export const createServerSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    },
  )
}
