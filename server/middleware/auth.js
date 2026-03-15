import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-this-default')
    const user = await User.findById(payload.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}
