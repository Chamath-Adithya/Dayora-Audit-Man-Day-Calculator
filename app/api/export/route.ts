import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage-db';
import { calculateAuditManDays } from '@/lib/audit-calculator-fixed';
import { jsPDF } from 'jspdf';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Calculation ID is required', { status: 400 });
  }

  try {
    const calculation = await storage.getCalculation(id);
    if (!calculation) {
      return new NextResponse('Calculation not found', { status: 404 });
    }
    const result = await calculateAuditManDays(calculation);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(20);
    pdf.text('Audit Man-Day Calculation Report', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Company: ${calculation.companyName}`, 20, 40);
    pdf.text(`Scope: ${calculation.scope}`, 20, 50);
    pdf.text(`Standard: ${calculation.standard}`, 20, 60);
    pdf.text(`Audit Type: ${calculation.auditType}`, 20, 70);
    pdf.text(`Category: ${calculation.category}`, 20, 80);
    pdf.text(`Employees: ${calculation.employees}`, 20, 90);
    pdf.text(`Sites: ${calculation.sites}`, 20, 100);
    pdf.text(`Risk Level: ${calculation.riskLevel}`, 20, 110);

    pdf.setFontSize(16);
    pdf.text('Calculation Results', 20, 130);

    pdf.setFontSize(12);
    pdf.text(`Total Man-Days: ${result.totalManDays}`, 20, 145);

    pdf.text('Breakdown:', 20, 160);
    pdf.text(`• Base Man-Days: ${result.breakdown.baseManDays}`, 30, 170);
    pdf.text(`• Employee Adjustment: ${result.breakdown.employeeAdjustment}`, 30, 180);
    pdf.text(`• Risk Adjustment: ${result.breakdown.riskAdjustment.toFixed(1)}`, 30, 190);
    pdf.text(`• Multi-Site Adjustment: ${result.breakdown.multiSiteAdjustment}`, 30, 200);
    pdf.text(`• Integrated System Adjustment: ${result.breakdown.integratedSystemAdjustment.toFixed(1)}`, 30, 210);

    if (result.stageDistribution) {
      pdf.text('Stage Distribution:', 20, 225);
      pdf.text(`• Stage 1: ${result.stageDistribution.stage1} days`, 30, 235);
      pdf.text(`• Stage 2: ${result.stageDistribution.stage2} days`, 30, 245);
    }

    const pdfBuffer = pdf.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit-calculation-${calculation.companyName}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
