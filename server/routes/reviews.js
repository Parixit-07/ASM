import express from 'express'
import Review from '../models/Review.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all reviews (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const reviews = await Review.find().populate('product', 'name').populate('user', 'name email').sort({ createdAt: -1 }).lean()
  res.json({ reviews })
})

// Approve / reject
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { approved } = req.body
  const review = await Review.findByIdAndUpdate(req.params.id, { approved }, { new: true })
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  res.json({ review })
})

// Delete review
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  res.json({ message: 'Review deleted' })
})

export default router
