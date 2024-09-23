import express from 'express'
import usersRouter from './users.mjs'
import postsRouter from './posts.mjs'

const router = express.Router()

router.use('/api/users', usersRouter)
router.use('/api/posts', postsRouter)

export default router
