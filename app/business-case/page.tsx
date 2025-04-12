"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Wind, Users, TrendingUp, BarChart2, Target, Zap, Globe, DollarSign } from "lucide-react"
import NavigationBar from "@/components/navigation-bar"

export default function BusinessCasePage() {
  return (
    <>
      <NavigationBar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 z-50 rounded-md"
      >
        Skip to main content
      </a>
      <div lang="en" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-sky-500 text-white py-8">
          <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Image
                src="/logo-icon.png"
                alt="Full Power Logo - Kitesurfing AI Platform"
                width={80}
                height={80}
                className="h-12 w-auto mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold">Full Power</h1>
                <p className="text-sm">AI Forecasting for Kitesurfing</p>
              </div>
            </div>

            {/* Header Content */}
            <div className="text-right">
              <p className="text-lg font-light">
                Connecting kitesurfers with perfect conditions through AI-powered forecasting.
              </p>
            </div>
          </div>
        </header>

        <main id="main-content">
          {/* Executive Summary */}
          <section className="py-16 bg-white" aria-labelledby="executive-summary-heading">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 id="executive-summary-heading" className="text-3xl font-bold mb-8 text-slate-800">
                Executive Summary
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-lg text-slate-700 leading-relaxed">
                  Full Power is an innovative AI-powered platform designed to revolutionize how kitesurfers find and
                  experience optimal wind conditions. By combining advanced weather forecasting technology with machine
                  learning algorithms, Full Power delivers hyper-accurate predictions tailored to the specific needs of
                  kitesurfers. This business case outlines the significant market opportunity, technical capabilities,
                  and partnership benefits for kite brands looking to enhance their market position, increase customer
                  engagement, and drive revenue growth through a strategic alliance with Full Power.
                </p>
              </div>
            </div>
          </section>

          {/* Market Analysis */}
          <section className="py-16 bg-slate-50" aria-labelledby="market-analysis-heading">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 id="market-analysis-heading" className="text-3xl font-bold mb-8 text-slate-800">
                Market Analysis & Opportunity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Growing Market</h3>
                  <p className="text-slate-900 mb-4">
                    The global kitesurfing market is projected to reach $2.5 billion by 2027, with a CAGR of 9.5%. With
                    over 1.5 million active kitesurfers worldwide and approximately 100,000-150,000 new participants
                    annually, the market presents substantial growth opportunities.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Digital Transformation</h3>
                  <p className="text-slate-700">
                    85% of kitesurfers use digital tools to check conditions before sessions, yet 73% report
                    dissatisfaction with the accuracy of current forecasting tools. This gap represents a significant
                    opportunity for innovation and market disruption.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Target Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Core Enthusiasts</h4>
                    <p className="text-slate-600 text-sm">
                      Dedicated kitesurfers (25-45) who ride 50+ days annually and spend $1,500-3,000 on equipment
                      yearly.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Weekend Warriors</h4>
                    <p className="text-slate-600 text-sm">
                      Occasional riders (30-55) who kite 15-30 days annually and are highly dependent on accurate
                      forecasts.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Traveling Kitesurfers</h4>
                    <p className="text-slate-600 text-sm">
                      Adventure seekers who plan 2-4 kite trips annually and spend $5,000-10,000 on kite travel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-700 to-sky-600 p-8 rounded-xl text-white">
                <h3 className="text-xl font-semibold mb-4">Market Gap</h3>
                <p className="mb-4 text-white">
                  Despite the growth in kitesurfing and the critical importance of accurate wind forecasting, the market
                  lacks a specialized platform that combines:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>AI-powered hyper-local forecasting specifically calibrated for kitesurfing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>Personalized recommendations based on rider skill level and equipment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>Community-driven data validation that improves accuracy over time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>Direct integration with kite brands for equipment recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Product Overview */}
          <section className="py-16 bg-white" aria-labelledby="product-overview-heading">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 id="product-overview-heading" className="text-3xl font-bold mb-8 text-slate-800">
                Product Overview & Technical Capabilities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="bg-blue-500/20 p-3 rounded-full mr-3">
                    <Wind className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    <span className="sr-only">Wind icon representing AI-Powered Forecasting</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">AI-Powered Forecasting</h3>
                  <p className="text-slate-600">
                    Proprietary algorithms that combine data from multiple weather sources with machine learning to
                    provide 95% accurate wind predictions up to 7 days in advance.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="bg-blue-500/20 p-3 rounded-full mr-3">
                    <Target className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    <span className="sr-only">Target icon representing Golden Window™ Technology</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Golden Window™ Technology</h3>
                  <p className="text-slate-600">
                    Identifies optimal riding windows based on wind speed, direction, consistency, and tides, with
                    personalized recommendations for kite sizes and equipment.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="bg-blue-500/20 p-3 rounded-full mr-3">
                    <Globe className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    <span className="sr-only">Globe icon representing Global Spot Database</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">Global Spot Database</h3>
                  <p className="text-slate-600">
                    Comprehensive database of over 2,500 kite spots worldwide with local insights, hazards, and
                    community-verified information updated in real-time.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 rounded-xl text-white mb-12">
                <h3 className="text-2xl font-semibold mb-6">Key Platform Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="flex items-center text-lg font-medium mb-3">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" aria-hidden="true" />
                      Personalized Forecasts
                    </h4>
                    <p className="text-white/80 pl-7">
                      Tailored predictions based on user preferences, skill level, and riding style, with automatic kite
                      size recommendations.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-medium mb-3">
                      <BarChart2 className="h-5 w-5 mr-2 text-green-400" aria-hidden="true" />
                      Equipment Matching
                    </h4>
                    <p className="text-white/80 pl-7">
                      AI-driven recommendations for optimal equipment based on forecasted conditions, with direct links
                      to partner brand products.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-medium mb-3">
                      <Users className="h-5 w-5 mr-2 text-blue-400" aria-hidden="true" />
                      Community Validation
                    </h4>
                    <p className="text-white/80 pl-7">
                      Crowdsourced real-time condition reports that improve forecast accuracy and create a network
                      effect of engaged users.
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-medium mb-3">
                      <TrendingUp className="h-5 w-5 mr-2 text-purple-400" aria-hidden="true" />
                      Advanced Analytics
                    </h4>
                    <p className="text-white/80 pl-7">
                      Comprehensive data on user behavior, equipment preferences, and session patterns to inform product
                      development and marketing strategies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Technical Infrastructure</h3>
                <p className="text-slate-700 mb-4">
                  Full Power is built on a robust, scalable cloud architecture utilizing:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Next.js and React for responsive front-end experiences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>FastAPI backend for high-performance data processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Machine learning models trained on 10+ years of historical data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Real-time data integration with multiple weather APIs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>PostgreSQL database with geospatial capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Vercel deployment for global CDN and edge computing</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Partnership Benefits */}
          <section className="py-16 bg-slate-50" aria-labelledby="partnership-value-heading">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 id="partnership-value-heading" className="text-3xl font-bold mb-8 text-slate-800">
                Partnership Value Proposition
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">For Kite Brands</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3 mt-0.5">
                        <DollarSign className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Increased Sales Conversion</span>
                        <p className="text-slate-600 text-sm mt-1">
                          Direct equipment recommendations at the moment of highest intent, with projected 15-20%
                          conversion rates on product suggestions.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3 mt-0.5">
                        <Users className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Enhanced Brand Loyalty</span>
                        <p className="text-slate-600 text-sm mt-1">
                          Continuous engagement with customers through the app, creating multiple touchpoints throughout
                          the year, not just at point of purchase.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3 mt-0.5">
                        <BarChart2 className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Valuable Market Insights</span>
                        <p className="text-slate-600 text-sm mt-1">
                          Access to anonymized data on rider preferences, usage patterns, and equipment needs to inform
                          product development and marketing strategies.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">For Kitesurfers</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3 mt-0.5">
                        <Wind className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Superior Forecasting</span>
                        <p className="text-slate-600 text-sm mt-1">
                          Hyper-accurate predictions that maximize time on the water and minimize wasted trips.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3 mt-0.5">
                        <Target className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Personalized Experience</span>
                        <p className="text-slate-600 text-sm mt-1">
                          Tailored recommendations based on individual preferences, skill level, and equipment.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3 mt-0.5">
                        <Zap className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Equipment Confidence</span>
                        <p className="text-slate-600 text-sm mt-1">
                          Trusted recommendations for the right gear based on actual conditions, improving safety and
                          session quality.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-8 rounded-xl text-white">
                <h3 className="text-2xl font-semibold mb-6">Partnership Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg">
                    <h4 className="text-lg font-medium mb-3">Premium Brand Integration</h4>
                    <p className="text-white/90 text-sm">
                      Featured placement of your brand's equipment in recommendations, with customized algorithms to
                      match your product line with ideal conditions.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg">
                    <h4 className="text-lg font-medium mb-3">Co-branded Experience</h4>
                    <p className="text-white/90 text-sm">
                      Custom-branded sections within the app featuring your latest products, team riders, and exclusive
                      content for Full Power users.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg">
                    <h4 className="text-lg font-medium mb-3">Data-Driven Insights</h4>
                    <p className="text-white/90 text-sm">
                      Quarterly reports on user engagement, product interest, and market trends to inform your product
                      development and marketing strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Revenue & Growth */}
          <section className="py-16 bg-white" aria-labelledby="revenue-growth-heading">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 id="revenue-growth-heading" className="text-3xl font-bold mb-8 text-slate-800">
                Revenue Projections & Growth Strategy
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Revenue Streams</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Partnership Fees</span>
                        <p className="text-slate-600 text-sm">
                          Tiered partnership packages ranging from $25,000 to $100,000 annually based on integration
                          level and exclusivity.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Affiliate Revenue</span>
                        <p className="text-slate-600 text-sm">
                          10-15% commission on equipment sales generated through the platform, with projected annual
                          revenue of $500,000 by Year 3.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Premium Subscriptions</span>
                        <p className="text-slate-600 text-sm">
                          $9.99/month or $79.99/year for advanced features, with projected 25,000 subscribers by end of
                          Year 2.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Data Licensing</span>
                        <p className="text-slate-600 text-sm">
                          Anonymized trend data and market insights for industry partners, with custom research packages
                          starting at $15,000.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Growth Strategy</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Strategic Partnerships</span>
                        <p className="text-slate-600 text-sm">
                          Alliances with 3-5 premium kite brands in Year 1, expanding to 10-12 by Year 3.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Influencer Marketing</span>
                        <p className="text-slate-600 text-sm">
                          Collaboration with professional riders and content creators to drive organic adoption and
                          brand credibility.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Event Integration</span>
                        <p className="text-slate-600 text-sm">
                          Presence at major kitesurfing competitions and festivals, with live forecasting and equipment
                          demos.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <span className="font-medium text-slate-800">Global Expansion</span>
                        <p className="text-slate-600 text-sm">
                          Initial focus on top 10 kitesurfing markets, expanding to 25+ countries by Year 3.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold mb-6 text-blue-600">5-Year Projection</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white" aria-labelledby="projection-table-heading">
                    <caption id="projection-table-heading" className="sr-only">
                      5-Year Financial Projection
                    </caption>
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th scope="col" className="py-3 px-4 text-left">
                          Metric
                        </th>
                        <th scope="col" className="py-3 px-4 text-right">
                          Year 1
                        </th>
                        <th scope="col" className="py-3 px-4 text-right">
                          Year 2
                        </th>
                        <th scope="col" className="py-3 px-4 text-right">
                          Year 3
                        </th>
                        <th scope="col" className="py-3 px-4 text-right">
                          Year 5
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-t border-slate-200">
                        <th scope="row" className="py-3 px-4 font-medium">
                          Active Users
                        </th>
                        <td className="py-3 px-4 text-right">25,000</td>
                        <td className="py-3 px-4 text-right">75,000</td>
                        <td className="py-3 px-4 text-right">150,000</td>
                        <td className="py-3 px-4 text-right">350,000</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <th scope="row" className="py-3 px-4 font-medium">
                          Brand Partners
                        </th>
                        <td className="py-3 px-4 text-right">3</td>
                        <td className="py-3 px-4 text-right">7</td>
                        <td className="py-3 px-4 text-right">12</td>
                        <td className="py-3 px-4 text-right">20</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <th scope="row" className="py-3 px-4 font-medium">
                          Annual Revenue
                        </th>
                        <td className="py-3 px-4 text-right">$450K</td>
                        <td className="py-3 px-4 text-right">$1.2M</td>
                        <td className="py-3 px-4 text-right">$3.5M</td>
                        <td className="py-3 px-4 text-right">$8.2M</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <th scope="row" className="py-3 px-4 font-medium">
                          Partner-Generated Sales
                        </th>
                        <td className="py-3 px-4 text-right">$1.5M</td>
                        <td className="py-3 px-4 text-right">$4.8M</td>
                        <td className="py-3 px-4 text-right">$12M</td>
                        <td className="py-3 px-4 text-right">$30M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Timeline */}
          <section className="py-16 bg-slate-50" aria-labelledby="implementation-timeline-heading">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 id="implementation-timeline-heading" className="text-3xl font-bold mb-8 text-slate-800">
                Implementation Timeline
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-blue-200 transform md:translate-x-0 translate-x-4"></div>

                {/* Timeline items */}
                <div className="space-y-12 relative">
                  {/* Phase 1 */}
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-blue-600">Phase 1: Partnership Launch</h3>
                      <p className="text-slate-600 mt-2">Q2 2024</p>
                      <div
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-3 md:ml-auto md:mr-0 max-w-md"
                        aria-describedby="phase1-description"
                      >
                        <p id="phase1-description" className="sr-only">
                          Phase 1 activities include finalizing partnership agreements, developing co-branded
                          experiences, and launching marketing campaigns.
                        </p>
                        <ul className="text-slate-700 text-sm space-y-2">
                          <li>• Finalize partnership agreements and integration specifications</li>
                          <li>• Develop co-branded experience and product recommendation engine</li>
                          <li>• Launch marketing campaign announcing the strategic partnership</li>
                        </ul>
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 relative">
                      <div
                        className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-white transform md:translate-x(-50%) translate-x(-50%)"
                        tabIndex={0}
                        role="button"
                        aria-label="Phase 1: Partnership Launch - Q2 2024"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            // Handle activation (same as click)
                            e.preventDefault()
                          }
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0 order-1 md:order-2">
                      <h3 className="text-xl font-semibold text-blue-600">Phase 2: Market Expansion</h3>
                      <p className="text-slate-600 mt-2">Q4 2024</p>
                      <div
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-3 md:ml-auto md:mr-0 max-w-md"
                        aria-describedby="phase2-description"
                      >
                        <p id="phase2-description" className="sr-only">
                          Phase 2 activities include expanding to 5 additional key kitesurfing markets, launching
                          advanced analytics dashboard for brand partners, and implementing AI-driven cross-selling
                          recommendations.
                        </p>
                        <ul className="text-slate-700 text-sm space-y-2">
                          <li>• Expand to 5 additional key kitesurfing markets</li>
                          <li>• Launch advanced analytics dashboard for brand partners</li>
                          <li>• Implement AI-driven cross-selling recommendations</li>
                        </ul>
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 relative order-2 md:order-1">
                      <div
                        className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-white transform md:translate-x(-50%) translate-x(-50%)"
                        tabIndex={0}
                        role="button"
                        aria-label="Phase 2: Market Expansion - Q4 2024"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            // Handle activation (same as click)
                            e.preventDefault()
                          }
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-blue-600">Phase 3: Feature Enhancement</h3>
                      <p className="text-slate-600 mt-2">Q2 2025</p>
                      <div
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-3 md:ml-auto md:mr-0 max-w-md"
                        aria-describedby="phase3-description"
                      >
                        <p id="phase3-description" className="sr-only">
                          Phase 3 activities include launching virtual equipment testing and comparison tools,
                          implementing community-driven spot verification system, and developing personalized training
                          recommendations based on conditions.
                        </p>
                        <ul className="text-slate-700 text-sm space-y-2">
                          <li>• Launch virtual equipment testing and comparison tools</li>
                          <li>• Implement community-driven spot verification system</li>
                          <li>• Develop personalized training recommendations based on conditions</li>
                        </ul>
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 relative">
                      <div
                        className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-white transform md:translate-x(-50%) translate-x(-50%)"
                        tabIndex={0}
                        role="button"
                        aria-label="Phase 3: Feature Enhancement - Q2 2025"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            // Handle activation (same as click)
                            e.preventDefault()
                          }
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="flex flex-col md:flex-row items-start">
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0 order-1 md:order-2">
                      <h3 className="text-xl font-semibold text-blue-600">Phase 4: Global Scaling</h3>
                      <p className="text-slate-600 mt-2">Q1 2026</p>
                      <div
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-3 md:ml-auto md:mr-0 max-w-md"
                        aria-describedby="phase4-description"
                      >
                        <p id="phase4-description" className="sr-only">
                          Phase 4 activities include expanding to all major global kitesurfing destinations, launching
                          Full Power Pro for schools and instructors, and developing integrated booking platform for
                          kite travel.
                        </p>
                        <ul className="text-slate-700 text-sm space-y-2">
                          <li>• Expand to all major global kitesurfing destinations</li>
                          <li>• Launch Full Power Pro for schools and instructors</li>
                          <li>• Develop integrated booking platform for kite travel</li>
                        </ul>
                      </div>
                    </div>
                    <div className="md:w-1/2 md:pl-12 relative order-2 md:order-1">
                      <div
                        className="absolute left-0 md:left-0 top-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-white transform md:translate-x(-50%) translate-x(-50%)"
                        tabIndex={0}
                        role="button"
                        aria-label="Phase 4: Global Scaling - Q1 2026"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            // Handle activation (same as click)
                            e.preventDefault()
                          }
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section
            className="py-16 bg-gradient-to-r from-blue-600 to-sky-500 text-white"
            aria-labelledby="call-to-action-heading"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="max-w-3xl mx-auto text-center">
                <h2 id="call-to-action-heading" className="text-3xl font-bold mb-6">
                  Join the Future of Kitesurfing
                </h2>
                <p className="text-xl mb-8">
                  Partner with Full Power to transform how kitesurfers experience your brand and products. Let's
                  revolutionize the industry together.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/test"
                    className="bg-white text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 px-8 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center"
                    aria-label="View interactive demo of Full Power platform"
                  >
                    View Demo
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-colors"
                    aria-label="Schedule a partnership call to discuss collaboration opportunities"
                  >
                    Schedule Partnership Call
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12" role="contentinfo">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Image src="/logo-icon.png" alt="Full Power Logo" width={120} height={120} className="h-16 w-auto" />
                <p className="text-slate-400 mt-2">Advanced AI Forecasting for Kitesurfing</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-slate-400">© 2024 Full Power. All rights reserved.</p>
                <p className="text-slate-500 mt-1">Contact: partnerships@fullpower.example.com</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
