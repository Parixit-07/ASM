import mongoose from 'mongoose'

export const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asha-shop'
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error', error)
    process.exit(1)
  }
}
