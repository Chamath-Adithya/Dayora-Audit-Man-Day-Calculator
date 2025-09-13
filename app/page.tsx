import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, History, Settings, Sparkles, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 animate-pulse">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dayora
            </h1>
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent animate-bounce" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-muted-foreground">
            Audit Man-Day Calculator
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Calculate audit man-days instantly based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022).
            Designed for certification professionals to streamline audit planning and resource allocation.
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="flex justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200 px-4">
          <Link href="/calculate">
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
              <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Start New Calculation</span>
              <span className="sm:hidden">New Calculation</span>
              <Zap className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:animate-pulse" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-300">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300 text-base sm:text-lg">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                Smart Calculations
              </CardTitle>
              <CardDescription className="group-hover:text-foreground/80 transition-colors duration-300 text-sm sm:text-base">
                Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards with support for multiple
                audit types and integrated systems.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300 text-base sm:text-lg">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                Detailed Reports
              </CardTitle>
              <CardDescription className="group-hover:text-foreground/80 transition-colors duration-300 text-sm sm:text-base">
                Generate comprehensive reports with calculation breakdowns, export to PDF or Excel, and maintain
                detailed audit documentation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500 sm:col-span-2 lg:col-span-1">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300 text-base sm:text-lg">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                History Tracking
              </CardTitle>
              <CardDescription className="group-hover:text-foreground/80 transition-colors duration-300 text-sm sm:text-base">
                Keep track of all calculations with searchable history, client management, and comparison tools for
                audit planning.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Standards Information */}
        <Card className="mt-8 sm:mt-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Supported Standards & Audit Types
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              This calculator supports the following management system standards and audit types:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Management Systems
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Quality Management System (QMS)</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Environmental Management System (EMS)</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Energy Management System (EnMS)</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Food Safety Management System (FSMS)</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Cosmetics Good Manufacturing Practice (GMP)</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold mb-3 text-base sm:text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Audit Types
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Initial Certification Audits</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Surveillance Audits</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Recertification Audits</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Integrated System Audits</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></div>
                    <span>Multi-site Audits</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Link href="/calculate" className="group">
            <Card className="hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group-hover:-translate-y-1 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-700">
              <CardContent className="flex items-center justify-center p-4 sm:p-6 group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">New Calculation</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history" className="group">
            <Card className="hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group-hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800">
              <CardContent className="flex items-center justify-center p-4 sm:p-6 group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">View History</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin" className="group sm:col-span-2 lg:col-span-1">
            <Card className="hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group-hover:-translate-y-1 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-900">
              <CardContent className="flex items-center justify-center p-4 sm:p-6 group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">Admin Settings</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
