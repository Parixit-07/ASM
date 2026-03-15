import express from 'express'
import User from '../models/User.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// List all customers (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const users = await User.find({ role: 'user' })
    .select('name email mobile createdAt')
    .lean()
    .sort({ createdAt: -1 })
  res.json({ users })
})

export default router
