import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const document = await PdfData.findById(params.id);
    
    if (!document) {
      return NextResponse.json({
        error: 'PDF not found'
      }, { status: 404 });
    }

    // Restore the PDF by removing the deleted flags
    await PdfData.findByIdAndUpdate(params.id, {
      isDeleted: false,
      deletedAt: null
    });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error restoring PDF:', error);
    return NextResponse.json({
      error: 'Failed to restore PDF'
    }, { status: 500 });
  }
} 