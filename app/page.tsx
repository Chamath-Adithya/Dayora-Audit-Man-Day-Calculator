"use client"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, History, Settings, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Modern Hero Section with Enhanced Visual Effects */}
        <div className="relative text-center space-y-8 overflow-hidden py-12">
          {/* Enhanced Animated Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 pattern-dots opacity-30"></div>
            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 animate-in fade-in-0 slide-in-from-top-4 duration-1000">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 animate-in fade-in-0 slide-in-from-left-4 duration-1000 delay-300 hover:from-primary/20 hover:to-accent/20 transition-all duration-500 hover:scale-110 hover:rotate-6 group shadow-modern">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary group-hover:text-accent transition-all duration-500 group-hover:rotate-12" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground animate-in fade-in-0 slide-in-from-right-4 duration-1000 delay-500 hover:scale-105 transition-transform duration-500">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent bg-300% animate-gradient">
                Dayora
              </span>
            </h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-700 hover:from-primary hover:to-accent transition-all duration-500">
            Professional Audit Calculator
          </h2>

          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-900 hover:text-foreground/90 transition-colors duration-300">
            Calculate audit man-days with <span className="font-semibold text-primary">precision and speed</span> using international standards 
            <span className="inline-block mx-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">IAF MD 5:2019</span> 
            and 
            <span className="inline-block mx-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">ISO/TS 22003:2022</span>
          </p>

          {/* Enhanced CTA with Advanced Animations */}
          <div className="pt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-1100">
            <Link href="/calculate">
              <Button size="lg" className="relative text-lg px-8 py-4 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-500 group overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <Calculator className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                  Start New Calculation
                  <Zap className="h-4 w-4 group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Advanced Feature Cards with Enhanced Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative text-center p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in-0 slide-in-from-left-4 duration-1000 delay-1200 group overflow-hidden border-l-4 border-l-blue-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative pb-4">
              <div className="relative w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 group-hover:scale-125 transition-all duration-500 group-hover:rotate-6">
                <Calculator className="h-8 w-8 text-blue-600 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-xl bg-blue-400/20 animate-ping"></div>
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">Smart Calculations</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards with real-time results.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative text-center p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-1400 group overflow-hidden border-l-4 border-l-emerald-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative pb-4">
              <div className="relative w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/20 group-hover:scale-125 transition-all duration-500 group-hover:rotate-6">
                <FileText className="h-8 w-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-xl bg-emerald-400/20 animate-ping"></div>
              </div>
              <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors duration-300">Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                Generate comprehensive reports with PDF and Excel export capabilities and custom templates.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-400"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative text-center p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in-0 slide-in-from-right-4 duration-1000 delay-1600 group overflow-hidden border-l-4 border-l-purple-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative pb-4">
              <div className="relative w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 group-hover:scale-125 transition-all duration-500 group-hover:rotate-6">
                <History className="h-8 w-8 text-purple-600 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-xl bg-purple-400/20 animate-ping"></div>
              </div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300">History Tracking</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                Keep track of all calculations with searchable history, client management, and comparison tools.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-400"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Standards Overview with Enhanced Animations */}
        <Card className="relative animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-1800 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
              <div className="relative p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                <Shield className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-lg bg-primary/20 animate-ping"></div>
              </div>
              <span className="group-hover:text-primary transition-colors duration-300">Supported Standards & Audit Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative animate-in fade-in-0 slide-in-from-left-4 duration-1000 delay-1900 group">
                <div className="absolute -left-2 top-0 w-1 h-full bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors duration-300"></div>
                <h4 className="font-semibold mb-3 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">Management Systems</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Quality Management System (QMS)
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
                    Environmental Management System (EMS)
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-400"></div>
                    Energy Management System (EnMS)
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-600"></div>
                    Food Safety Management System (FSMS)
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-800"></div>
                    Cosmetics Good Manufacturing Practice (GMP)
                  </li>
                </ul>
              </div>
              <div className="relative animate-in fade-in-0 slide-in-from-right-4 duration-1000 delay-2000 group">
                <div className="absolute -left-2 top-0 w-1 h-full bg-emerald-500 rounded-full group-hover:bg-emerald-600 transition-colors duration-300"></div>
                <h4 className="font-semibold mb-3 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300">Audit Types</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Initial Certification Audits
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                    Surveillance Audits
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-400"></div>
                    Recertification Audits
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-600"></div>
                    Integrated System Audits
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 delay-400">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-800"></div>
                    Multi-site Audits
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-2100 group border border-primary/10">
              <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="font-medium text-primary group-hover:text-primary/80 transition-colors duration-300">
                  All calculations follow IAF MD 5:2019 and ISO/TS 22003:2022 standards with 99% accuracy.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Quick Access with Enhanced Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/calculate">
            <Card className="relative p-4 hover:bg-blue-500/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-in fade-in-0 slide-in-from-left-4 duration-1000 delay-2200 group overflow-hidden border-l-4 border-l-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-0">
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300">
                    <Calculator className="h-5 w-5 text-blue-600 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="absolute inset-0 rounded-lg bg-blue-400/20 animate-ping"></div>
                  </div>
                  <span className="font-medium group-hover:text-blue-600 transition-colors duration-300">New Calculation</span>
                </div>
                <div className="mt-3 flex gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-400"></div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="relative p-4 hover:bg-emerald-500/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-2300 group overflow-hidden border-l-4 border-l-emerald-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-0">
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-300">
                    <History className="h-5 w-5 text-emerald-600 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="absolute inset-0 rounded-lg bg-emerald-400/20 animate-ping"></div>
                  </div>
                  <span className="font-medium group-hover:text-emerald-600 transition-colors duration-300">View History</span>
                </div>
                <div className="mt-3 flex gap-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-400"></div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="relative p-4 hover:bg-purple-500/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-in fade-in-0 slide-in-from-right-4 duration-1000 delay-2400 group overflow-hidden border-l-4 border-l-purple-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-0">
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300">
                    <Settings className="h-5 w-5 text-purple-600 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="absolute inset-0 rounded-lg bg-purple-400/20 animate-ping"></div>
                  </div>
                  <span className="font-medium group-hover:text-purple-600 transition-colors duration-300">Admin Settings</span>
                </div>
                <div className="mt-3 flex gap-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-400"></div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
