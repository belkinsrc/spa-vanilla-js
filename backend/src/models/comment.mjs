import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
