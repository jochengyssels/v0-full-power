import Link from "next/link"
import NavigationBar from "@/components/navigation-bar"
import { Database, Leaf, Upload, FileJson, Code, Server } from "lucide-react"

export default function AdminPage() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10 max-w-4xl w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-white/80 mb-6">Use these utilities to set up and manage your kite spot database.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/setup"
              className="bg-slate-700/50 hover:bg-slate-700/80 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-600/30 flex flex-col items-center text-center"
            >
              <Database className="h-10 w-10 text-blue-400 mb-2" />
              <h2 className="text-lg font-semibold text-white">Database Setup</h2>
              <p className="text-white/70 text-sm mt-1">Create database tables and schema</p>
            </Link>

            <Link
              href="/admin/seed"
              className="bg-slate-700/50 hover:bg-slate-700/80 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-600/30 flex flex-col items-center text-center"
            >
              <Leaf className="h-10 w-10 text-green-400 mb-2" />
              <h2 className="text-lg font-semibold text-white">Seed Data</h2>
              <p className="text-white/70 text-sm mt-1">Populate database with initial data</p>
            </Link>

            <Link
              href="/admin/import"
              className="bg-slate-700/50 hover:bg-slate-700/80 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-600/30 flex flex-col items-center text-center"
            >
              <Upload className="h-10 w-10 text-purple-400 mb-2" />
              <h2 className="text-lg font-semibold text-white">Import CSV</h2>
              <p className="text-white/70 text-sm mt-1">Import data from CSV files</p>
            </Link>

            <Link
              href="/admin/popular-spots"
              className="bg-slate-700/50 hover:bg-slate-700/80 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-600/30 flex flex-col items-center text-center"
            >
              <FileJson className="h-10 w-10 text-amber-400 mb-2" />
              <h2 className="text-lg font-semibold text-white">Popular Spots</h2>
              <p className="text-white/70 text-sm mt-1">View interaction analytics</p>
            </Link>

            <Link
              href="/admin/api-explorer"
              className="bg-slate-700/50 hover:bg-slate-700/80 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-600/30 flex flex-col items-center text-center"
            >
              <Code className="h-10 w-10 text-emerald-400 mb-2" />
              <h2 className="text-lg font-semibold text-white">API Explorer</h2>
              <p className="text-white/70 text-sm mt-1">Browse and test Supabase APIs</p>
            </Link>

            <Link
              href="/test"
              className="bg-slate-700/50 hover:bg-slate-700/80 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-slate-600/30 flex flex-col items-center text-center"
            >
              <Server className="h-10 w-10 text-rose-400 mb-2" />
              <h2 className="text-lg font-semibold text-white">Connection Test</h2>
              <p className="text-white/70 text-sm mt-1">Test database connectivity</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
