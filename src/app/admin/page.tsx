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
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [data, setData] = useState<IPdfData[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsFetching(true)
            const response = await fetch('/api/pdfs')
            const result = await response.json()
            setData(result.data)
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to fetch PDFs')
        } finally {
            setIsFetching(false)
        }
    }

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

    const handleDeleteClick = async (id: string) => {
        try {
            const response = await fetch(`/api/pdfs/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to delete PDF');
            }

            toast.success('PDF deleted successfully');
            setIsFetching(true);
            const refetch = await fetch('/api/pdfs');
            const refetchData = await refetch.json();
            setData(refetchData.data);
        } catch (err) {
            console.error('Error deleting PDF:', err);
            toast.error('Failed to delete PDF');
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black">
            <BackgroundBeams />
            <Spotlight />
            <Toaster position="top-right" />

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

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-sm">Title</Label>
                                            <Input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter PDF title"
                                                className="bg-white/90 backdrop-blur text-black"
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
                                    </div>
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
                        
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-white/70">Title</TableHead>
                                        <TableHead className="text-white/70">Type</TableHead>
                                        <TableHead className="text-white/70">Views</TableHead>
                                        <TableHead className="text-white/70">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="text-white/70">{item.title}</TableCell>
                                            <TableCell className="text-white/70">{item.type}</TableCell>
                                            <TableCell className="text-white/70">{item.views}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(item._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}