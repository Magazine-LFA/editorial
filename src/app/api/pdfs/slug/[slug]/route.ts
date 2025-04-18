import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import PdfData from '@/models/pdfData';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect();
        
        const { slug } = params;
        if (!slug) {
            return NextResponse.json({
                success: false,
                error: 'Slug is required'
            }, { status: 400 });
        }

        const pdf = await PdfData.findOne({ 
            slug,
            isDeleted: false 
        });
        
        if (!pdf) {
            return NextResponse.json({
                success: false,
                error: 'PDF not found'
            }, { status: 404 });
        }

        // Get the view tracking cookie
        const cookieStore = cookies();
        const viewCookie = cookieStore.get(`pdf_view_${pdf._id}`);
        const now = new Date();
        
        // If no cookie exists or it's been more than 24 hours since last view
        if (!viewCookie || (now.getTime() - new Date(viewCookie.value).getTime()) > 24 * 60 * 60 * 1000) {
            // Increment views
            const updatedPdf = await PdfData.findByIdAndUpdate(
                pdf._id,
                { $inc: { views: 1 } },
                { new: true }
            );

            // Set cookie for 24 hours
            const response = NextResponse.json({
                success: true,
                data: updatedPdf
            });

            response.cookies.set(`pdf_view_${pdf._id}`, now.toISOString(), {
                expires: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                path: '/',
                httpOnly: true,
                sameSite: 'strict'
            });

            return response;
        }

        // If cookie exists and it's been less than 24 hours, return without incrementing
        return NextResponse.json({
            success: true,
            data: pdf
        });

    } catch (error) {
        console.error('Error fetching PDF:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch PDF'
        }, { status: 500 });
    }
} 