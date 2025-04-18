'use client';

import { useState, useEffect, use } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { PDFFlipBook } from '@/components/ui/pdf-flipbook';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function PDFViewer({ params }: PageProps) {
    const resolvedParams = use(params);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [views, setViews] = useState<number>(0);

    useEffect(() => {
        const fetchPdfData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/pdfs/slug/${resolvedParams.slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch PDF data');
                }
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch PDF');
                }

                if (!data.data?.fileUrl) {
                    throw new Error('Invalid PDF URL');
                }
                
                setPdfUrl(data.data.fileUrl);
                setViews(data.data.views || 0);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPdfData();
    }, [resolvedParams.slug]);

    const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {resolvedParams.slug.replace(/-/g, ' ')}
                        </h1>
                        <p className="text-gray-400">
                            {views} views
                        </p>
                    </div>

                    <Document
                        file={pdfUrl}
                        onLoadSuccess={handleDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                        }
                        error={
                            <div className="text-red-500 text-center">
                                Failed to load PDF
                            </div>
                        }
                    >
                        <PDFFlipBook numPages={numPages} />
                    </Document>
                </div>
            </div>
        </div>
    );
} 