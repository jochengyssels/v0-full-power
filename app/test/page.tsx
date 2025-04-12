"use client"

import NavigationBar from "@/components/navigation-bar"
import ConnectionTester from "./connection-tester"

export default function TestPage() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 p-4 pt-16">
        <div className="max-w-4xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Database Connection Test</h1>
          <p className="text-white/70">
            Test your Supabase connection and view your database schema. This page helps you verify that your database
            is properly set up and accessible.
          </p>
        </div>
        <ConnectionTester />
      </div>
    </>
  )
}
