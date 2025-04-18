import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'PDF ID is required'
      }, { status: 400 });
    }

    const pdf = await PdfData.findById(id);
    
    if (!pdf) {
      return NextResponse.json({
        success: false,
        error: 'PDF not found'
      }, { status: 404 });
    }

    // Update without validation
    await PdfData.findByIdAndUpdate(id, {
      isDeleted: false,
      deletedAt: null
    }, { runValidators: false });

    return NextResponse.json({
      success: true,
      message: 'PDF restored successfully'
    });
  } catch (error) {
    console.error('Error restoring PDF:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to restore PDF'
    }, { status: 500 });
  }
} 