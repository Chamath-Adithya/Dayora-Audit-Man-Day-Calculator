"use client"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, History, Settings, Sparkles, Shield, Zap, Users, Clock, Award, TrendingUp, Play, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Enhanced Hero Section */}
        <div className="relative text-center space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          {/* Subtle Background Visuals */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
            <div className="p-3 sm:p-4 rounded-full bg-primary/10 animate-pulse shadow-lg">
              <Shield className="h-7 w-7 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
              Dayora
            </h1>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-accent animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-3xl font-semibold text-muted-foreground">
            Audit Man-Day Calculator
          </h2>

          <p className="text-base sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            Calculate audit man-days instantly based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022).
            Designed for certification professionals to streamline audit planning and resource allocation.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 max-w-4xl mx-auto px-4">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                <span className="text-2xl sm:text-3xl font-bold text-foreground">500+</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-accent mr-2" />
                <span className="text-2xl sm:text-3xl font-bold text-foreground">10k+</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Calculations</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                <span className="text-2xl sm:text-3xl font-bold text-foreground">15+</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Standards</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent mr-2" />
                <span className="text-2xl sm:text-3xl font-bold text-foreground">99%</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Start Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200 px-4">
          <Link href="/calculate" className="w-full sm:w-auto">
            <Button size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Calculator className="mr-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Start New Calculation</span>
              <span className="sm:hidden">New Calculation</span>
              <Zap className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            </Button>
          </Link>

          <Link href="/history" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg border-2 hover:border-primary/50 w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">View Demo</span>
              <span className="sm:hidden">Demo</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold text-primary">500+ professionals</span> who trust Dayora for accurate audit calculations
          </p>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Why Choose Dayora?
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Experience the power of precision audit calculations with our advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Smart Calculations Card */}
            <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-300 border-l-4 border-l-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
                    <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Most Popular
                  </Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-blue-600 transition-colors duration-300 mb-3">
                  Smart Calculations
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                  Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards with support for multiple
                  audit types and integrated systems.
                </CardDescription>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time Results</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Multi-standard Support</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Detailed Reports Card */}
            <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400 border-l-4 border-l-emerald-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-300 group-hover:scale-110">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    Professional
                  </Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-emerald-600 transition-colors duration-300 mb-3">
                  Detailed Reports
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                  Generate comprehensive reports with calculation breakdowns, export to PDF or Excel, and maintain
                  detailed audit documentation.
                </CardDescription>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>PDF & Excel Export</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Custom Templates</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* History Tracking Card */}
            <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500 border-l-4 border-l-purple-500 sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                    <History className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    Advanced
                  </Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-purple-600 transition-colors duration-300 mb-3">
                  History Tracking
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                  Keep track of all calculations with searchable history, client management, and comparison tools for
                  audit planning.
                </CardDescription>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Search & Filter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Client Management</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Enhanced Standards Information */}
        <Card className="mt-16 sm:mt-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600 overflow-hidden">
          <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              Supported Standards & Audit Types
            </CardTitle>
            <CardDescription className="text-base sm:text-lg mt-2">
              This calculator supports comprehensive management system standards and audit types based on international requirements
            </CardDescription>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                All Standards
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-primary/10">
                Management Systems
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-primary/10">
                Audit Types
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-primary/10">
                Most Used
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Management Systems */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-blue-600">
                    Management Systems
                  </h4>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    5 Standards
                  </Badge>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Quality Management System (QMS)", icon: "🎯", color: "bg-blue-500" },
                    { name: "Environmental Management System (EMS)", icon: "🌱", color: "bg-green-500" },
                    { name: "Energy Management System (EnMS)", icon: "⚡", color: "bg-yellow-500" },
                    { name: "Food Safety Management System (FSMS)", icon: "🍎", color: "bg-red-500" },
                    { name: "Cosmetics Good Manufacturing Practice (GMP)", icon: "✨", color: "bg-purple-500" }
                  ].map((system, index) => (
                    <div key={index} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${system.color} group-hover:scale-125 transition-transform duration-200`}></div>
                      <span className="text-sm sm:text-base group-hover:text-foreground transition-colors duration-200">
                        {system.icon} {system.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Types */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-emerald-600">
                    Audit Types
                  </h4>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    5 Types
                  </Badge>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Initial Certification Audits", icon: "🚀", color: "bg-emerald-500" },
                    { name: "Surveillance Audits", icon: "👁️", color: "bg-blue-500" },
                    { name: "Recertification Audits", icon: "🔄", color: "bg-orange-500" },
                    { name: "Integrated System Audits", icon: "🔗", color: "bg-purple-500" },
                    { name: "Multi-site Audits", icon: "🌐", color: "bg-indigo-500" }
                  ].map((audit, index) => (
                    <div key={index} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${audit.color} group-hover:scale-125 transition-transform duration-200`}></div>
                      <span className="text-sm sm:text-base group-hover:text-foreground transition-colors duration-200">
                        {audit.icon} {audit.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Standards Compliance Info */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground mb-2">Standards Compliance</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All calculations are based on the latest international standards including
                    <span className="font-medium text-primary"> IAF MD 5:2019</span> and
                    <span className="font-medium text-primary"> ISO/TS 22003:2022</span>.
                    Regular updates ensure continued compliance with evolving requirements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Access Links */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Get Started
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Choose your path to begin your audit calculation journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* New Calculation Card */}
            <Link href="/calculate" className="group">
              <Card className="relative overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer group-hover:-translate-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-700 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
                      <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      Popular
                    </Badge>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    New Calculation
                  </h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-4">
                    Start a fresh audit calculation with our guided workflow
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                    <span>Get started</span>
                    <Zap className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* View History Card */}
            <Link href="/history" className="group">
              <Card className="relative overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 cursor-pointer group-hover:-translate-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-300 group-hover:scale-110">
                      <History className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                      Recent
                    </Badge>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold group-hover:text-emerald-600 transition-colors duration-300 mb-2">
                    View History
                  </h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-4">
                    Access your previous calculations and audit records
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <span>Browse all</span>
                    <History className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Admin Settings Card */}
            <Link href="/admin" className="group sm:col-span-2 lg:col-span-1">
              <Card className="relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer group-hover:-translate-y-2 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-900 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                      <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      Admin
                    </Badge>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold group-hover:text-purple-600 transition-colors duration-300 mb-2">
                    Admin Settings
                  </h4>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-4">
                    Configure system settings and manage configurations
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                    <span>Configure</span>
                    <Settings className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <Card className="mt-16 sm:mt-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1000">
          <CardHeader className="text-center p-6 sm:p-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              What Our Users Say
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Trusted by certification professionals worldwide
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Lead Auditor, QualityCert Inc.",
                  content: "Dayora has revolutionized our audit planning process. The accuracy and speed of calculations save us hours of manual work.",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Certification Manager, Global Standards Ltd.",
                  content: "The comprehensive standards support and detailed reporting features make Dayora an essential tool for our team.",
                  rating: 5
                },
                {
                  name: "Emma Rodriguez",
                  role: "Compliance Officer, EcoSafe Solutions",
                  content: "Outstanding accuracy and user-friendly interface. The history tracking helps us maintain perfect audit records.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tutorial Video Section */}
        <Card className="mt-16 sm:mt-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1100">
          <CardHeader className="text-center p-6 sm:p-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Quick Start Tutorial
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Learn how to use Dayora in just 2 minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="h-8 w-8 sm:h-10 sm:w-10 text-primary ml-1" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      Watch Tutorial Video
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Learn the basics of audit calculation in 2 minutes
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    2 min tutorial
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-16 sm:mt-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1200">
          <CardHeader className="text-center p-6 sm:p-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Quick answers to common questions about Dayora
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "How accurate are the calculations?",
                  answer: "Dayora provides 99% accuracy based on IAF MD 5:2019 and ISO/TS 22003:2022 standards. All calculations are automatically validated against international requirements."
                },
                {
                  question: "Can I export my reports?",
                  answer: "Yes, you can export all calculation reports in PDF and Excel formats. Custom templates are also available for professional documentation."
                },
                {
                  question: "What standards does Dayora support?",
                  answer: "Dayora supports 15+ international standards including QMS, EMS, EnMS, FSMS, and Cosmetics GMP, covering all major management system certifications."
                },
                {
                  question: "Is my data secure?",
                  answer: "Absolutely. All data is encrypted and stored securely. We follow industry best practices for data protection and privacy compliance."
                }
              ].map((faq, index) => (
                <Card key={index} className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">{faq.question}</h5>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blog Feed Preview */}
        <Card className="mt-16 sm:mt-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1300">
          <CardHeader className="text-center p-6 sm:p-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Latest Updates
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Stay informed with the latest audit standards and best practices
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Understanding IAF MD 5:2019 Updates",
                  excerpt: "Key changes in the latest IAF mandatory document and their impact on audit calculations...",
                  date: "September 15, 2025",
                  readTime: "5 min read"
                },
                {
                  title: "Best Practices for Multi-Site Audits",
                  excerpt: "Learn how to efficiently manage complex audit scenarios with multiple locations...",
                  date: "September 10, 2025",
                  readTime: "7 min read"
                }
              ].map((post, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        Article
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h5 className="font-semibold text-foreground mb-2 text-lg">
                      {post.title}
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="text-primary font-medium hover:underline">Read more →</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" className="hover:bg-primary/10">
                View All Articles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
