import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

const generateToken = (user) => {
  const payload = { userId: user._id, role: user.role }
  const secret = process.env.JWT_SECRET || 'change-this-default'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

// Admin login - email + password
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await User.findOne({ email })
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const valid = await user.comparePassword(password)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user)
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

// Admin stats
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  const totalProducts = await Product.countDocuments()
  const totalOrders = await Order.countDocuments()
  const completedOrders = await Order.countDocuments({ status: 'delivered' })
  const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'shipped'] } })
  const totalCustomers = await User.countDocuments({ role: 'user' })
  const revenueResult = await Order.aggregate([
    { $group: { _id: null, revenue: { $sum: '$total' } } },
  ])

  const revenue = revenueResult?.[0]?.revenue || 0

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

  const lowStockProducts = await Product.find({ inStock: { $lte: 5 } }).sort({ inStock: 1 }).limit(5).lean()

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        quantitySold: { $sum: '$items.quantity' },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 5 },
  ])

  const productIds = topProducts.map((p) => p._id)
  const topProductDocs = await Product.find({ _id: { $in: productIds } }).lean()

  const topSelling = topProducts.map((entry) => {
    const matched = topProductDocs.find((p) => String(p._id) === String(entry._id))
    return {
      ...matched,
      quantitySold: entry.quantitySold,
    }
  })

  res.json({
    totalProducts,
    totalOrders,
    completedOrders,
    pendingOrders,
    totalCustomers,
    revenue,
    recentOrders,
    lowStockProducts,
    topSelling,
  })
})

export default router
