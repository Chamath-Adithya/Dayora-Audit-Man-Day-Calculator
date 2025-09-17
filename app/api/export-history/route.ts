import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { jsPDF } from 'jspdf';

export async function POST(req: NextRequest) {
  const { calculations } = await req.json();

  try {
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(20);
    pdf.text('Audit Calculation History Report', pageWidth / 2, 20, { align: 'center' });

    const tableHeaders = ['Date', 'Company', 'Standard', 'Type', 'Category', 'Employees', 'Risk', 'Result'];
    const colWidths = [25, 40, 20, 25, 15, 20, 15, 20];
    let xPos = 20;

    pdf.setFontSize(10);
    pdf.setFillColor(240, 240, 240);

    tableHeaders.forEach((header, index) => {
      pdf.rect(xPos, 40, colWidths[index], 8, 'F');
      pdf.text(header, xPos + 2, 45);
      xPos += colWidths[index];
    });

    let yPos = 48;
    calculations.forEach((calc: any) => {
      if (yPos > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage();
        yPos = 20;
      }

      xPos = 20;
      const rowData = [
        new Date(calc.createdAt).toLocaleDateString(),
        calc.companyName.length > 25 ? calc.companyName.substring(0, 22) + '...' : calc.companyName,
        calc.standard,
        calc.auditType,
        calc.category,
        calc.employees.toString(),
        calc.riskLevel,
        calc.result.toString()
      ];

      rowData.forEach((data, index) => {
        pdf.rect(xPos, yPos, colWidths[index], 6);
        pdf.text(data, xPos + 2, yPos + 4);
        xPos += colWidths[index];
      });

      yPos += 6;
    });

    const pdfBuffer = pdf.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit-history.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
