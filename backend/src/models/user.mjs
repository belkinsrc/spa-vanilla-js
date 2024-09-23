import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_fullname: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('User', userSchema)

export default User
