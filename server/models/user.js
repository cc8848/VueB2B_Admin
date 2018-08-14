import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  role: {
    type: String,
    default: 'user',
  },
  username: String,
  password: String,
  country: {
    type: String,
    default: 'Indonisia'
  },
  email: String,
  nickname: String,
  motto: String,
  avatar: String,
  shipAddressList: {
    type: Array,
    default: []
  },
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// hidden some field
UserSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.id
    delete ret.password
  }
}
mongoose.model('User', UserSchema)
