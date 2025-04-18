import mongoose from 'mongoose'

export interface IPdfData {
  _id: string;
  title: string;
  description?: string;
  type: 'editorial' | 'magazine';
  fileUrl: string;
  slug: string;
  views: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PdfDataSchema = new mongoose.Schema<IPdfData>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['editorial', 'magazine'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
}, {
  timestamps: true
})

const PdfData = mongoose.models.PdfData || mongoose.model<IPdfData>('PdfData', PdfDataSchema)

export default PdfData
