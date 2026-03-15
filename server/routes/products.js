import express from 'express'
import Product from '../models/Product.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public listing with optional filters
router.get('/', async (req, res) => {
  const { category, brand, minPrice, maxPrice, rating, q } = req.query
  const query = {}

  if (category) query.category = category
  if (brand) query.brand = brand
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) }
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) }
  if (rating) query.rating = { $gte: Number(rating) }
  if (q) query.$text = { $search: q }

  const products = await Product.find(query).lean().limit(200)
  res.json({ products })
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).lean()
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json({ product })
})

// Admin routes
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json({ product })
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json({ product })
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json({ message: 'Product deleted' })
})

export default router
