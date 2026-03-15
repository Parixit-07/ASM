import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDb } from './config/db.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import productsRoutes from './routes/products.js'
import ordersRoutes from './routes/orders.js'
import usersRoutes from './routes/users.js'
import reviewsRoutes from './routes/reviews.js'
import { errorHandler } from './middleware/errorHandler.js'
import { seedProducts, seedAdminUser } from './seed/seed.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send({ message: 'Asha Sewing Machine API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/reviews', reviewsRoutes)

app.use(errorHandler)

const start = async () => {
  await connectDb()
  if (process.env.SEED_DATA === 'true') {
    await seedProducts()
    await seedAdminUser()
  }
  app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`)
  })
}

start()
