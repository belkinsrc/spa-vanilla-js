import express from 'express'
import { getPosts, getPostById } from '../controllers/posts.mjs'
import { getCommentsByPost } from '../controllers/comments.mjs'

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPostById)
router.get('/:id/comments', getCommentsByPost)

export default router
