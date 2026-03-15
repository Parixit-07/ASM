import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const generateToken = (user) => {
  const payload = { userId: user._id }
  const secret = process.env.JWT_SECRET || 'change-this-default'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

// Simple login simulation - uses name + mobile
router.post('/login', async (req, res) => {
  const { name, mobile } = req.body
  if (!name || !mobile) {
    return res.status(400).json({ message: 'Name and mobile number are required.' })
  }

  let user = await User.findOne({ mobile })
  if (!user) {
    user = await User.create({ name, mobile, role: mobile === '0000000000' ? 'admin' : 'user' })
  } else {
    user.name = name
    await user.save()
  }

  const token = generateToken(user)
  return res.json({ token, user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role, isAdmin: user.role === 'admin' } })
})

router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-this-default')
    const user = await User.findById(payload.userId)
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return res.json({ id: user._id, name: user.name, mobile: user.mobile, role: user.role, isAdmin: user.role === 'admin' })
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
})

export default router
