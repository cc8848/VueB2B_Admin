import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  id: String,
  name: {
    type: String,
    required: true
  },
  description: String,
  img: String,
  sort: {
    type: Number,
    default: 1
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

CategorySchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}
// db.articles.update({}, {$set: {flag: 1}}, {multi: 1})
mongoose.model('Category', CategorySchema)