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
        {/* Clean Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Dayora
            </h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-muted-foreground">
            Audit Man-Day Calculator
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Calculate audit man-days accurately in seconds based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022).
          </p>

          {/* Primary CTA */}
          <div className="pt-4">
            <Link href="/calculate">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90">
                <Calculator className="mr-2 h-5 w-5" />
                Start New Calculation
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate comprehensive reports with PDF and Excel export capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <History className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">History Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep track of all calculations with searchable history and client management.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Standards Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Supported Standards & Audit Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Management Systems</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Quality Management System (QMS)</li>
                  <li>• Environmental Management System (EMS)</li>
                  <li>• Energy Management System (EnMS)</li>
                  <li>• Food Safety Management System (FSMS)</li>
                  <li>• Cosmetics Good Manufacturing Practice (GMP)</li>
                </ul>
              </div>
              <div>
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
            <div className="mt-4 p-3 bg-muted/50 rounded text-sm text-muted-foreground">
              All calculations follow IAF MD 5:2019 and ISO/TS 22003:2022 standards with 99% accuracy.
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/calculate">
            <Card className="p-4 hover:bg-primary/5 transition-colors cursor-pointer">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="font-medium">New Calculation</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="p-4 hover:bg-primary/5 transition-colors cursor-pointer">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-primary" />
                  <span className="font-medium">View History</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="p-4 hover:bg-primary/5 transition-colors cursor-pointer">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="font-medium">Admin Settings</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
