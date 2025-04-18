import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  req: NextRequest, 
  context: RouteParams
) {
  try {
    await dbConnect();

    // Await the params Promise to get the slug
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const pdf = await PdfData.findOne({ slug, isDeleted: false });

    if (!pdf) {
      return NextResponse.json(
        { success: false, error: 'PDF not found' },
        { status: 404 }
      );
    }

    // Increment views directly without cookie check
    const updatedPdf = await PdfData.findByIdAndUpdate(
      pdf._id,
      { $inc: { views: 1 } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedPdf,
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}