import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';
import { deleteFile } from '@/lib/cloudinary';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const pdf = await PdfData.findById(params.id);
    
    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    // Extract filename from the URL
    const urlParts = pdf.fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Delete file from Cloudinary
    const deleteResult = await deleteFile(fileName);
    if (!deleteResult.success) {
      console.error('Failed to delete file from Cloudinary:', deleteResult.error);
    }

    // Delete from database
    await PdfData.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to delete PDF' },
      { status: 500 }
    );
  }
} 