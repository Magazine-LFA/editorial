import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongo'
import PdfData from '@/models/pdfData'
import { uploadFile } from '@/lib/firebase-storage'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const scheduled_date = new Date(formData.get('scheduled_date') as string)
    const type = formData.get('type') as 'magazine' | 'editorial'
    
    // Generate a clean slug from the title
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

    // Validate required fields
    if (!file || !title || !scheduled_date || !type) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: { file: !!file, title: !!title, scheduled_date: !!scheduled_date, type: !!type }
      }, { status: 400 })
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Connect to the database first
    try {
      await dbConnect()
    } catch (dbError) {
      console.error('❌ MongoDB connection failed:', dbError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Upload file to Firebase Storage
    const fileName = `${slug}-${Date.now()}.pdf`
    const fileUrl = await uploadFile(file, fileName)

    // Save metadata to MongoDB
    try {
      const newDoc = await PdfData.create({
        title,
        slug,
        fileUrl,
        scheduled_date,
        type,
        views: 0
      });

      return NextResponse.json({ 
        success: true, 
        data: newDoc 
      })
    } catch (mongoError) {
      console.error('❌ MongoDB validation error:', mongoError)
      
      return NextResponse.json({ 
        error: 'Data validation failed', 
        message: mongoError instanceof Error ? mongoError.message : 'Unknown validation error'
      }, { status: 400 })
    }

  } catch (err) {
    console.error('❌ Upload handler failed:', err)
    return NextResponse.json({ 
      error: 'Upload failed', 
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}