import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs/promises'
import path from 'path'
import express from 'express'
import cors from 'cors'
import router from './routes/index.mjs'
import { connectToDatabase, disconnectFromDatabase } from './db.mjs'
import User from './models/user.mjs'
import Post from './models/post.mjs'
import Comment from './models/comment.mjs'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error)
    throw error
  }
}

async function initializeUsers() {
  try {
    const usersPath = path.join(__dirname, 'static', 'users.json')
    const users = await readJsonFile(usersPath)

    for (const usrs of users) {
      const user = new User({
        id: usrs.id,
        user_name: usrs.user_name,
        user_fullname: usrs.user_fullname,
      })
      await user.save()
    }

    console.log('Users initialized successfully')
  } catch (error) {
    console.error('Error initializing users:', error)
  }
}

async function initializePosts() {
  try {
    const postsPath = path.join(__dirname, 'static', 'posts.json')
    const posts = await readJsonFile(postsPath)

    for (const psts of posts) {
      const post = new Post({
        id: psts.id,
        userId: psts.userId,
        createdAt: psts.createdAt,
        title: psts.title,
        text: psts.text,
      })
      await post.save()
    }

    console.log('Posts initialized successfully')
  } catch (error) {
    console.error('Error initializing posts:', error)
  }
}

async function initializeComments() {
  try {
    const commentsPath = path.join(__dirname, 'static', 'comments.json')
    const comments = await readJsonFile(commentsPath)

    for (const cmments of comments) {
      const comment = new Comment({
        id: cmments.id,
        userId: cmments.userId,
        createdAt: cmments.createdAt,
        postId: cmments.postId,
        text: cmments.text,
      })
      await comment.save()
    }

    console.log('Comments initialized successfully')
  } catch (error) {
    console.error('Error initializing comments:', error)
  }
}

;(async () => {
  try {
    await connectToDatabase()
    await initializeUsers()
    await initializePosts()
    await initializeComments()

    app.use(cors())
    app.use(express.json())
    app.use(router)

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })

    process.on('SIGINT', async () => {
      await disconnectFromDatabase()
      console.log('Disconnected from database')
      process.exit(0)
    })
  } catch (error) {
    console.error('Failed to start application:', error)
    process.exit(1)
  }
})()
