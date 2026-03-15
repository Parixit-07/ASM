import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    inStock: { type: Number, default: 0 },
    shortSpecs: { type: [String], default: [] },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
)

productSchema.index({ name: 'text', description: 'text', brand: 'text' })

export default mongoose.model('Product', productSchema)
