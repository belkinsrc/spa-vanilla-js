import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.MONGODB_URL

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(url)
    console.log('Connected successfully to MongoDB')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  }
}

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (err) {
    console.error('Failed to disconnect from MongoDB', err)
  }
}
