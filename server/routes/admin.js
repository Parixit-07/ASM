import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Constants
const TOKEN_EXPIRY = '7d'
const ORDER_STATUSES = {
  COMPLETED: 'delivered',
  PENDING: ['pending', 'confirmed', 'shipped'],
}
const LOW_STOCK_THRESHOLD = 5
const QUERY_LIMITS = {
  RECENT_ORDERS: 5,
  LOW_STOCK: 5,
  TOP_PRODUCTS: 5,
}

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User object with _id and role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = { userId: user._id, role: user.role }
  const secret = process.env.JWT_SECRET || 'change-this-default'
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY })
}

/**
 * Admin login endpoint
 * @route POST /login
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Object} JWT token and user data
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' })
    }

    const user = await User.findOne({ email })
    if (!user || user.role !== 'admin') {
      console.warn(`Admin login attempt with non-admin email: ${email}`)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      console.warn(`Admin login attempt with incorrect password for: ${email}`)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    console.log(`Admin login successful: ${email}`)
    
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    next(error)
  }
})

/**
 * Get admin statistics and dashboard data
 * @route GET /stats
 * @security Bearer token required, admin role required
 * @returns {Object} Dashboard statistics including products, orders, customers, revenue
 */
router.get('/stats', authenticate, requireAdmin, async (req, res, next) => {
  try {
    // Fetch all stats in parallel for better performance
    const [
      totalProducts,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCustomers,
      revenueResult,
      recentOrders,
      lowStockProducts,
      topProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: ORDER_STATUSES.COMPLETED }),
      Order.countDocuments({ status: { $in: ORDER_STATUSES.PENDING } }),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(QUERY_LIMITS.RECENT_ORDERS)
        .lean(),
      Product.find({ inStock: { $lte: LOW_STOCK_THRESHOLD } })
        .sort({ inStock: 1 })
        .limit(QUERY_LIMITS.LOW_STOCK)
        .lean(),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            quantitySold: { $sum: '$items.quantity' },
          },
        },
        { $sort: { quantitySold: -1 } },
        { $limit: QUERY_LIMITS.TOP_PRODUCTS },
      ]),
    ])

    const revenue = revenueResult?.[0]?.revenue || 0

    // Fetch product details for top selling products
    let topSelling = []
    if (topProducts.length > 0) {
      const productIds = topProducts.map((p) => p._id)
      const topProductDocs = await Product.find({ _id: { $in: productIds } }).lean()

      topSelling = topProducts.map((entry) => {
        const matched = topProductDocs.find((p) => String(p._id) === String(entry._id))
        return matched
          ? {
              ...matched,
              quantitySold: entry.quantitySold,
            }
          : null
      }).filter(Boolean)
    }

    console.log('Dashboard stats retrieved successfully')

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
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    next(error)
  }
})

export default router
