import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SubclassSchema = new Schema({
  id: String,
  name: String,
  img: String,
  sort: {
    type: Number,
    default: 1
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }, 
  thirdclass: Array,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

SubclassSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}
// db.articles.update({}, {$set: {flag: 1}}, {multi: 1})
mongoose.model('Subclass', SubclassSchema)
