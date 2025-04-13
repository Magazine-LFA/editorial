import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongo'
import PdfData from '@/models/pdfData'

export async function GET() {
  await dbConnect()
  const data = await PdfData.find().sort({ createdAt: -1 })
  return NextResponse.json(data)
}
