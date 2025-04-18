import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongo'
import PdfData from '@/models/pdfData'

export async function GET() {
  try {
    await dbConnect()
    const data = await PdfData.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching PDFs:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch PDFs' 
    }, { status: 500 })
  }
}
