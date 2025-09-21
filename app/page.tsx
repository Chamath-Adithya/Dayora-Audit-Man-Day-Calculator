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
        {/* Enhanced Hero Section with Animations */}
        <div className="text-center space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
              Dayora
            </h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
            Audit Man-Day Calculator
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700">
            Calculate audit man-days accurately in seconds based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022).
          </p>

          {/* Primary CTA with Animation */}
          <div className="pt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-900">
            <Link href="/calculate">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 group">
                <Calculator className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Start New Calculation
                <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Core Features with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-1000 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Calculator className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">Smart Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1100 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <FileText className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Generate comprehensive reports with PDF and Excel export capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-1200 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <History className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">History Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Keep track of all calculations with searchable history and client management.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Standards Overview with Animation */}
        <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Supported Standards & Audit Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-1400">
                <h4 className="font-semibold mb-3">Management Systems</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Quality Management System (QMS)</li>
                  <li>• Environmental Management System (EMS)</li>
                  <li>• Energy Management System (EnMS)</li>
                  <li>• Food Safety Management System (FSMS)</li>
                  <li>• Cosmetics Good Manufacturing Practice (GMP)</li>
                </ul>
              </div>
              <div className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-1500">
                <h4 className="font-semibold mb-3">Audit Types</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Initial Certification Audits</li>
                  <li>• Surveillance Audits</li>
                  <li>• Recertification Audits</li>
                  <li>• Integrated System Audits</li>
                  <li>• Multi-site Audits</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1600">
              All calculations follow IAF MD 5:2019 and ISO/TS 22003:2022 standards with 99% accuracy.
            </div>
          </CardContent>
        </Card>

        {/* Quick Access with Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/calculate">
            <Card className="p-4 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-1700 group">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium group-hover:text-primary transition-colors duration-300">New Calculation</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="p-4 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1800 group">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium group-hover:text-primary transition-colors duration-300">View History</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="p-4 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-1900 group">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium group-hover:text-primary transition-colors duration-300">Admin Settings</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
