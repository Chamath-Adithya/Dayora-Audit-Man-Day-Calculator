import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, History, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Audit Man-Day Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate audit man-days instantly based on international standards (IAF MD 5:2019 and ISO/TS 22003:2022).
            Designed for certification professionals to streamline audit planning and resource allocation.
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="flex justify-center">
          <Link href="/calculate">
            <Button size="lg" className="text-lg px-8 py-6">
              <Calculator className="mr-2 h-5 w-5" />
              Start New Calculation
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Smart Calculations
              </CardTitle>
              <CardDescription>
                Automated calculations based on IAF MD 5:2019 and ISO/TS 22003:2022 standards with support for multiple
                audit types and integrated systems.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Detailed Reports
              </CardTitle>
              <CardDescription>
                Generate comprehensive reports with calculation breakdowns, export to PDF or Excel, and maintain
                detailed audit documentation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                History Tracking
              </CardTitle>
              <CardDescription>
                Keep track of all calculations with searchable history, client management, and comparison tools for
                audit planning.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Standards Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Supported Standards & Audit Types</CardTitle>
            <CardDescription>
              This calculator supports the following management system standards and audit types:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Management Systems</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Quality Management System (QMS)</li>
                  <li>• Environmental Management System (EMS)</li>
                  <li>• Energy Management System (EnMS)</li>
                  <li>• Food Safety Management System (FSMS)</li>
                  <li>• Cosmetics Good Manufacturing Practice (GMP)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Audit Types</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Initial Certification Audits</li>
                  <li>• Surveillance Audits</li>
                  <li>• Recertification Audits</li>
                  <li>• Integrated System Audits</li>
                  <li>• Multi-site Audits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/calculate">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <Calculator className="mr-2 h-5 w-5" />
                New Calculation
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <History className="mr-2 h-5 w-5" />
                View History
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-center p-6">
                <Settings className="mr-2 h-5 w-5" />
                Admin Settings
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
