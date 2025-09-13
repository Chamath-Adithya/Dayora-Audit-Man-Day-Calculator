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
        <div className="text-center space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 animate-pulse">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dayora
            </h1>
            <Sparkles className="h-6 w-6 text-accent animate-bounce" />
          </div>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Audit Man-Day Calculator
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Calculate audit man-days instantly based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022).
            Designed for certification professionals to streamline audit planning and resource allocation.
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="flex justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
          <Link href="/calculate">
            <Button size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Calculator className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Start New Calculation
              <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Calculator className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                Smart Calculations
              </CardTitle>
              <CardDescription className="group-hover:text-foreground/80 transition-colors duration-300">
                Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards with support for multiple
                audit types and integrated systems.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                Detailed Reports
              </CardTitle>
              <CardDescription className="group-hover:text-foreground/80 transition-colors duration-300">
                Generate comprehensive reports with calculation breakdowns, export to PDF or Excel, and maintain
                detailed audit documentation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <History className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                History Tracking
              </CardTitle>
              <CardDescription className="group-hover:text-foreground/80 transition-colors duration-300">
                Keep track of all calculations with searchable history, client management, and comparison tools for
                audit planning.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Standards Information */}
        <Card className="mt-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Supported Standards & Audit Types
            </CardTitle>
            <CardDescription>
              This calculator supports the following management system standards and audit types:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Management Systems
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Quality Management System (QMS)
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Environmental Management System (EMS)
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Energy Management System (EnMS)
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Food Safety Management System (FSMS)
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Cosmetics Good Manufacturing Practice (GMP)
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Audit Types
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Initial Certification Audits
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Surveillance Audits
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Recertification Audits
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Integrated System Audits
                  </li>
                  <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    Multi-site Audits
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/calculate" className="group">
            <Card className="hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group-hover:-translate-y-1 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-700">
              <CardContent className="flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Calculator className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="ml-3 font-medium">New Calculation</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history" className="group">
            <Card className="hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group-hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800">
              <CardContent className="flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <History className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="ml-3 font-medium">View History</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin" className="group">
            <Card className="hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group-hover:-translate-y-1 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-900">
              <CardContent className="flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Settings className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="ml-3 font-medium">Admin Settings</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
