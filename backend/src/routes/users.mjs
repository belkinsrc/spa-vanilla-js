import express from 'express'
import { getUsers, getUserById } from '../controllers/users.mjs'
import { getCommentsByUser } from '../controllers/comments.mjs'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/:id/comments', getCommentsByUser)

export default router
