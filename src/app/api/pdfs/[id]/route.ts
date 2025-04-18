import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';
import { deleteFile } from '@/lib/firebase-storage';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
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

    // Delete file from Firebase Storage
    try {
      const fileName = pdf.fileUrl.split('/').pop();
      if (fileName) {
        await deleteFile(fileName);
      }
    } catch (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue with the deletion even if storage deletion fails
    }

    // Update without validation
    await PdfData.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date()
    }, { runValidators: false });

    return NextResponse.json({
      success: true,
      message: 'PDF deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete PDF'
    }, { status: 500 });
  }
} 