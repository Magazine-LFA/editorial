'use client';

import { useState, useRef, useEffect } from 'react';
import { Page } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { motion } from 'framer-motion';

interface PDFFlipBookProps {
    numPages: number | null;
}

export const PDFFlipBook = ({ numPages }: PDFFlipBookProps) => {
    const [width, setWidth] = useState<number>(800);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const bookRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (isFullscreen) {
                setWidth(window.innerWidth - 100);
            } else {
                const containerWidth = window.innerWidth;
                setWidth(Math.min(containerWidth - 100, 800));
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isFullscreen]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            bookRef.current?.pageFlip().flipPrev();
        }
    };

    const handleNextPage = () => {
        if (numPages && currentPage < numPages) {
            setCurrentPage(prev => prev + 1);
            bookRef.current?.pageFlip().flipNext();
        }
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleRotateLeft = () => {
        setRotation(prev => (prev - 90) % 360);
    };

    const handleRotateRight = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const PageComponent = ({ pageNumber }: { pageNumber: number }) => (
        <div className="page">
            <Page
                pageNumber={pageNumber}
                width={width / 2}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="page-content"
                scale={scale}
                rotate={rotation}
            />
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-4 w-full" ref={containerRef}>
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-black/40 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="hover:bg-white/10 text-white"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <span className="text-white min-w-[100px] text-center">
                        Page {currentPage} of {numPages}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextPage}
                        disabled={currentPage === numPages}
                        className="hover:bg-white/10 text-white"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-white/20" />

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={scale >= 2}
                        className="hover:bg-white/10 text-white"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                    <span className="text-white min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomOut}
                        disabled={scale <= 0.5}
                        className="hover:bg-white/10 text-white"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-white/20" />

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotateLeft}
                        className="hover:bg-white/10 text-white"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotateRight}
                        className="hover:bg-white/10 text-white"
                    >
                        <RotateCw className="h-5 w-5" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-white/20" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="hover:bg-white/10 text-white"
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-5 w-5" />
                    ) : (
                        <Maximize2 className="h-5 w-5" />
                    )}
                </Button>
            </div>

            <motion.div 
                className="book-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <HTMLFlipBook
                    width={width}
                    height={width * 1.414} // A4 aspect ratio
                    size="stretch"
                    minWidth={315}
                    maxWidth={800}
                    minHeight={400}
                    maxHeight={1131}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    ref={bookRef}
                    className="demo-book"
                >
                    {Array.from({ length: numPages || 0 }, (_, i) => (
                        <div key={i} className="page">
                            <PageComponent pageNumber={i + 1} />
                        </div>
                    ))}
                </HTMLFlipBook>
            </motion.div>

            <style jsx global>{`
                .book-container {
                    perspective: 2000px;
                    transform-style: preserve-3d;
                }
                .page {
                    background-color: white;
                    padding: 20px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                    transform-style: preserve-3d;
                }
                .page-content {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transform-style: preserve-3d;
                }
                .demo-book {
                    margin: 0 auto;
                    transform-style: preserve-3d;
                }
                .page-flip {
                    transform-style: preserve-3d;
                }
                .page-flip .page {
                    transform-style: preserve-3d;
                }
                .page-flip .page-content {
                    transform-style: preserve-3d;
                }
            `}</style>
        </div>
    );
}; 