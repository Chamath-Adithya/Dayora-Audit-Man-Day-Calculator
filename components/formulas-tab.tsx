"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronRight, Calculator, Download, FileText, ExternalLink } from "lucide-react"
import { formulasData, searchFormulas } from "@/lib/formulas-data"
import type { FormulaSection, FormulaContent } from "@/lib/formulas-data"
import { useConfig } from "./config-provider"

interface FormulaExampleProps {
  example: {
    description: string
    inputs: Record<string, number>
    calculation: string
    result: number
  }
}

function FormulaExample({ example }: FormulaExampleProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
      <p className="text-sm font-medium text-muted-foreground">{example.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Inputs</h5>
          <div className="space-y-1">
            {Object.entries(example.inputs).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Calculation</h5>
          <div className="space-y-2">
            <div className="text-sm font-mono bg-background p-2 rounded border">
              {example.calculation}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Result:</span>
              <Badge variant="secondary" className="font-mono">
                {example.result}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FormulaVariablesProps {
  variables: Array<{
    name: string
    description: string
    type: 'input' | 'config' | 'calculated'
    unit?: string
  }>
}

function FormulaVariables({ variables }: FormulaVariablesProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'input': return 'bg-blue-100 text-blue-800'
      case 'config': return 'bg-green-100 text-green-800'
      case 'calculated': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-3">
      <h5 className="text-sm font-medium text-muted-foreground">Variables</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {variables.map((variable, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
            <Badge className={getTypeColor(variable.type)} variant="secondary">
              {variable.type}
            </Badge>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{variable.name}</span>
                {variable.unit && (
                  <span className="text-xs text-muted-foreground">({variable.unit})</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface FormulaContentProps {
  content: FormulaContent
}

function FormulaContent({ content }: FormulaContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Calculator className="h-4 w-4 text-muted-foreground" />
          <div>
            <h4 className="font-medium">{content.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {content.explanation.length > 100
                ? `${content.explanation.substring(0, 100)}...`
                : content.explanation
              }
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t">
          <div className="space-y-6 pt-4">
            {/* Formula */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-2">Formula</h5>
              <div className="bg-muted/50 p-4 rounded-lg">
                <code className="text-sm font-mono break-all">{content.formula}</code>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-2">Explanation</h5>
              <p className="text-sm leading-relaxed">{content.explanation}</p>
            </div>

            {/* Variables */}
            {content.variables.length > 0 && (
              <FormulaVariables variables={content.variables} />
            )}

            {/* Examples */}
            {content.examples.length > 0 && (
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-muted-foreground">Examples</h5>
                {content.examples.map((example, index) => (
                  <FormulaExample key={index} example={example} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface FormulaSectionProps {
  section: FormulaSection
}

function FormulaSection({ section }: FormulaSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{section.icon}</div>
              <div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{section.content.length} formulas</Badge>
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </div>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              {section.content.map((content) => (
                <FormulaContent key={content.id} content={content} />
              ))}
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  )
}

export function FormulasTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const { config } = useConfig()

  const filteredFormulas = useMemo(() => {
    return searchFormulas(searchQuery)
  }, [searchQuery])

  const handleExportPDF = () => {
    // This would integrate with a PDF generation library
    alert("PDF export functionality would be implemented here with a library like jsPDF or react-to-pdf")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Man-Days Calculation Formulas
              </CardTitle>
              <CardDescription>
                Complete reference for all calculation formulas based on IAF MD 5:2019 and ISO/TS 22003:2022 standards
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search formulas, variables, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {searchQuery && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {filteredFormulas.length} section{filteredFormulas.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
              {filteredFormulas.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulas */}
      <div className="h-[calc(100vh-400px)] overflow-y-auto">
        <div className="space-y-4">
          {filteredFormulas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No formulas found matching your search.</p>
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="mt-2">
                  Clear search
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredFormulas.map((section) => (
              <FormulaSection key={section.id} section={section} />
            ))
          )}
        </div>
      </div>


    </div>
  )
}
