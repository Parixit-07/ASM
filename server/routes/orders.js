import express from 'express'
import Order from '../models/Order.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// Create order
router.post('/', authenticate, async (req, res) => {
  const { items, address, paymentMethod, total } = req.body
  if (!items?.length || !address) {
    return res.status(400).json({ message: 'Invalid order payload' })
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 80
  const order = await Order.create({
    user: req.user._id,
    items,
    address,
    paymentMethod,
    subtotal,
    shipping,
    total: total ?? subtotal + shipping,
    orderId: uuidv4().slice(0, 8).toUpperCase(),
  })

  res.status(201).json({ order: formatOrder(order) })
})

// Get current user's orders
router.get('/', authenticate, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user._id }
  const orders = await Order.find(query).sort({ createdAt: -1 }).lean()
  res.json({ orders: orders.map(formatOrder) })
})

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id })
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  if (req.user.role !== 'admin' && !order.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  res.json({ order: formatOrder(order) })
})

// Admin: update status
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body
  const order = await Order.findOneAndUpdate({ orderId: req.params.id }, { status }, { new: true })
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  res.json({ order: formatOrder(order) })
})

const formatOrder = (order) => {
  return {
    id: order.orderId,
    createdAt: order.createdAt,
    status: order.status,
    items: order.items,
    address: order.address,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    estimatedDelivery: order.estimatedDelivery,
  }
}

export default router
