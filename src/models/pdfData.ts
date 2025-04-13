import mongoose from 'mongoose'

const PdfDataSchema = new mongoose.Schema({
  gdrive: String,
  title: String,
  slug: String,
  type: { type: String, enum: ['magazine', 'editorial'] },
  views: { type: Number, default: 0 },
  scheduled_date: Date,
}, {
  timestamps: true
})

export default mongoose.models.PdfData || mongoose.model('PdfData', PdfDataSchema)
