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

export default function AdminPage() {
    const [title, setTitle] = useState('')
    const [scheduledDate, setScheduledDate] = useState('')
    const [type, setType] = useState<'magazine' | 'editorial'>('magazine')
    const [file, setFile] = useState<File | null>(null)
    const [data, setData] = useState<any[]>([])
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isFetching, setIsFetching] = useState(true) // Start with true to show loading initially

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            try {
                const res = await axios.get('/api/pdfs')
                setData(res.data)
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
        formData.append('scheduled_date', scheduledDate)
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
            setScheduledDate('')
            setType('magazine')
            setFile(null)
            setOpen(false)

            setIsFetching(true)
            const refetch = await fetch('/api/pdfs')
            const refetchData = await refetch.json()
            setData(refetchData)
        } catch (err) {
            console.error('Something went wrong:', err)
            toast.error('Something went wrong')
        } finally {
            setIsUploading(false)
            setIsFetching(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto py-16 px-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Upload PDF</Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-semibold text-center text-white">
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
                                                onChange={(e) => setType(e.target.value as any)}
                                                disabled={isUploading}
                                            >
                                                <option value="magazine">Magazine</option>
                                                <option value="editorial">Editorial</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-sm">Scheduled Date</Label>
                                            <Input
                                                type="date"
                                                value={scheduledDate}
                                                onChange={(e) => setScheduledDate(e.target.value)}
                                                className="bg-white/90 backdrop-blur rounded-md text-black p-2"
                                                disabled={isUploading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-sm">PDF File</Label>
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0]
                                                if (!f) return
                                                if (f.size > 1024 * 1024 * 1024) {
                                                    toast.error('File must be under 1 GB')
                                                    return
                                                }
                                                setFile(f)
                                            }}
                                            className="bg-white/90 backdrop-blur rounded-md text-black"
                                            disabled={isUploading}
                                        />
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
                    <hr />
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Uploaded PDFs</h2>
                            {isFetching && <p className="text-blue-400 text-sm animate-pulse">Fetching data...</p>}
                        </div>
                        
                        {/* Table is always rendered unless there's no data AND we're not fetching */}
                        {isFetching ? (
                            <div className="bg-white/5 rounded-lg p-6 text-center">
                                <p className="text-blue-400 animate-pulse">Loading data...</p>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="bg-white/5 rounded-lg p-6 text-center">
                                <p className="text-gray-400">No PDFs found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-white">Title</TableHead>
                                        <TableHead className="text-white">Slug</TableHead>
                                        <TableHead className="text-white">Date</TableHead>
                                        <TableHead className="text-white">Views</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow key={item._id} className="hover:bg-white/10">
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.slug}</TableCell>
                                            <TableCell>
                                                {item.scheduled_date?.split('T')[0]}
                                            </TableCell>
                                            <TableCell>{item.views}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}