import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';

export async function GET() {
  try {
    await dbConnect();
    
    const magazines = await PdfData.find({ 
      type: 'magazine',
    })
      .sort({ createdAt: -1 })
      .lean();

    // Convert createdAt strings to Date objects
    const formattedMagazines = magazines.map(magazine => ({
      ...magazine,
      createdAt: new Date(magazine.createdAt)
    }));

    return NextResponse.json({ success: true, data: formattedMagazines });
  } catch (error) {
    console.error('Error fetching magazines:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch magazines. Please try again later.'
    }, { status: 500 });
  }
} 