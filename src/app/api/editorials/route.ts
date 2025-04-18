import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';

export async function GET() {
  try {
    await dbConnect();
    
    const editorials = await PdfData.find({ 
      type: 'editorial',
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .lean();

    // Convert createdAt strings to Date objects
    const formattedEditorials = editorials.map(editorial => ({
      ...editorial,
      createdAt: new Date(editorial.createdAt)
    }));

    return NextResponse.json({ success: true, data: formattedEditorials });
  } catch (error) {
    console.error('Error fetching editorials:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch editorials. Please try again later.'
    }, { status: 500 });
  }
} 