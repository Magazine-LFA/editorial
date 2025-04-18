'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import Image from 'next/image'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Spotlight } from '@/components/ui/spotlight'
import { FileUpload } from "@/components/ui/file-upload"
import type { IPdfData } from "@/models/pdfData"
import { Trash2 } from 'lucide-react'

export default function AdminPage() {
    const [title, setTitle] = useState('')
    const [type, setType] = useState<'magazine' | 'editorial'>('magazine')
    const [file, setFile] = useState<File | null>(null)
    const [data, setData] = useState<IPdfData[]>([])
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [selectedType, setSelectedType] = useState<'magazine' | 'editorial'>('magazine')
    const [pdfToDelete, setPdfToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            try {
                const res = await axios.get('/api/pdfs')
                if (res.data.success) {
                    setData(res.data.data)
                } else {
                    toast.error('Failed to load PDFs')
                }
            } catch (err) {
                console.error('Failed to fetch PDFs:', err)
                toast.error('Failed to load PDFs')
            } finally {
                setIsFetching(false)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async () => {
        if (!file) {
            toast.error('PDF file required')
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title)
        formData.append('type', type)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json()
                console.error('Upload failed:', errorData)
                toast.error('Upload failed: ' + (errorData?.error || 'Unknown error'))
                return
            }

            toast.success('PDF uploaded successfully!')
            setTitle('')
            setType('magazine')
            setFile(null)
            setOpen(false)

            setIsFetching(true)
            const refetch = await fetch('/api/pdfs')
            const refetchData = await refetch.json()
            setData(refetchData.data)
        } catch (err) {
            console.error('Something went wrong:', err)
            toast.error('Something went wrong')
        } finally {
            setIsUploading(false)
            setIsFetching(false)
        }
    }

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        setFile(file);
        toast.success("File selected successfully");
    };

    const fetchPdfs = async () => {
        try {
            setIsFetching(true);
            const response = await fetch("/api/pdfs");
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            setData(data.data);
        } catch (error) {
            toast.error("Failed to fetch PDFs");
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setPdfToDelete(id);
    };

    const handleDeleteConfirm = async () => {
        if (!pdfToDelete) return;
        
        try {
            const response = await fetch(`/api/pdfs/${pdfToDelete}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete PDF');
            }
            
            toast.success('PDF deleted successfully');
            // Refresh the data
            setData(data.filter(item => item._id !== pdfToDelete));
        } catch (error) {
            console.error('Error deleting PDF:', error);
            toast.error('Failed to delete PDF');
        } finally {
            setPdfToDelete(null);
        }
    };

    const handleRestoreClick = async (id: string) => {
        try {
            const response = await fetch(`/api/pdfs/${id}/restore`, {
                method: 'PATCH',
            });
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to restore PDF');
            }
            
            toast.success('PDF restored successfully');
            // Update the local state
            setData(data.map(item => 
                item._id === id ? { ...item, isDeleted: false } : item
            ));
        } catch (error) {
            console.error('Error restoring PDF:', error);
            toast.error('Failed to restore PDF');
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#010314]">
            {/* Semi-transparent white background */}
            <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-sm z-0" />
            
            {/* Background beams effect */}
            <BackgroundBeams />
            
            {/* Spotlight effect */}
            <Spotlight 
                gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .05) 0, hsla(210, 100%, 55%, .01) 50%, hsla(210, 100%, 45%, 0) 80%)"
                gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .03) 0, hsla(210, 100%, 55%, .01) 80%, transparent 100%)"
                gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .02) 0, hsla(210, 100%, 45%, .01) 80%, transparent 100%)"
                translateY={-400}
                duration={8}
            />

            <Toaster position="top-center" />
            
            <div className="relative z-10 max-w-6xl mx-auto py-8 px-4 min-h-screen">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        {/* LFA Logo */}
                        <div className="w-[50px] h-[50px] relative">
                            <Image
                                src="/assets/LFA.png"
                                alt="LFA Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-gradient-to-b from-white via-[#a0a0a0] to-[#707070] bg-clip-text">
                            Admin Dashboard
                        </h1>

                        <div className="ml-auto">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                        Upload PDF
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-md bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-semibold text-center text-transparent bg-gradient-to-b from-white via-[#a0a0a0] to-[#707070] bg-clip-text">
                                            Upload New PDF
                                        </DialogTitle>
                                    </DialogHeader>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1">
                                            <Label className="text-sm">Title</Label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter PDF title"
                                                className="bg-white/90 backdrop-blur rounded-md text-black"
                                                disabled={isUploading}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-sm">Type</Label>
                                                <select
                                                    className="w-full p-2 border rounded-md bg-white/90 backdrop-blur text-black"
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value as 'magazine' | 'editorial')}
                                                    disabled={isUploading}
                                                >
                                                    <option value="magazine">Magazine</option>
                                                    <option value="editorial">Editorial</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-sm">PDF File</Label>
                                            <div className="w-full max-w-4xl mx-auto border border-dashed bg-white/5 dark:bg-black/20 border-neutral-200 dark:border-neutral-800 rounded-lg">
                                                <FileUpload onChange={handleFileUpload} />
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={handleSubmit}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </motion.div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-transparent bg-gradient-to-b from-white via-[#a0a0a0] to-[#707070] bg-clip-text">
                                Uploaded PDFs
                            </h2>
                            {isFetching && (
                                <p className="text-blue-400 text-sm animate-pulse">
                                    Fetching data...
                                </p>
                            )}
                        </div>
                        
                        {isFetching ? (
                            <div className="bg-white/5 rounded-lg p-6 text-center">
                                <p className="text-blue-400 animate-pulse">Loading data...</p>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="bg-white/5 rounded-lg p-6 text-center">
                                <p className="text-gray-400">No PDFs found.</p>
                            </div>
                        ) : (
                            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-white/5">
                                            <TableHead className="text-white/70">Title</TableHead>
                                            <TableHead className="text-white/70">Slug</TableHead>
                                            <TableHead className="text-white/70">Type</TableHead>
                                            <TableHead className="text-white/70">Views</TableHead>
                                            <TableHead className="text-white/70">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((item) => (
                                            <TableRow key={item._id} className="hover:bg-white/5">
                                                <TableCell className="text-white">
                                                    <div className="flex items-center gap-2">
                                                        {item.isDeleted && (
                                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                        )}
                                                        {item.title}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white/70">{item.slug}</TableCell>
                                                <TableCell className="text-white/70">{item.type}</TableCell>
                                                <TableCell className="text-white/70">{item.views}</TableCell>
                                                <TableCell>
                                                    {!item.isDeleted ? (
                                                        <AlertDialog open={pdfToDelete === item._id} onOpenChange={(open: boolean) => !open && setPdfToDelete(null)}>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDeleteClick(item._id)}
                                                                    className="hover:bg-red-500/10 hover:text-red-500 text-white/70"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-400">
                                                                        This action cannot be undone. This will permanently delete the PDF.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-transparent border border-white/20 text-white hover:bg-white/10">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={handleDeleteConfirm}
                                                                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRestoreClick(item._id)}
                                                            className="hover:bg-green-500/10 hover:text-green-500 text-white/70"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 2v6h6" />
                                                                <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
                                                            </svg>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}