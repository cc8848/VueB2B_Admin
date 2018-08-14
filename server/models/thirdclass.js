import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ThirdclassSchema = new Schema({
  id: String,
  name: String,
  sort: {
    type: Number,
    default: 1
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }, 
  subclass: {
    type: Schema.Types.ObjectId,
    ref: 'Subclass'
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

ThirdclassSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}
// db.articles.update({}, {$set: {flag: 1}}, {multi: 1})
mongoose.model('Thirdclass', ThirdclassSchema)
