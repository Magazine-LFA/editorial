import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import dbConnect from '@/lib/mongo'
import PdfData from '@/models/pdfData'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload file to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'pdf_uploads',
          public_id: `${slug}-${Date.now()}`,
          format: 'pdf',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      Readable.from(buffer).pipe(stream)
    })

    // Save metadata to MongoDB without page_view_type
    try {
      const newDoc = await PdfData.create({
        title,
        slug,
        gdrive: result.secure_url,
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