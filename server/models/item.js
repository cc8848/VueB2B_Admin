import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  id: String,
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Merchant'
  },
  sort: Number,
  hotLevel: {
    type: Number,
    default: 0
  }, // 0,1,2,3热度依次上升
  passStatus: {
    type: String,
    default: 'review'
  }, //商品状态 'passed','review','reject', 'soldout'
  sellQty: { //已售数量
    type: Number,
    default: 0
  },
  disputeQty: { //争议订单数量
    type: Number,
    default: 0
  },
  soldoutReason: String, // 下架理由
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  subclass: {
    type: Schema.Types.ObjectId,
    ref: 'Subclass'
  },
  thirdclass: String,
  name: String,
  brand: String,
  price: Number,
  description: String,
  mainImg: String,
  carouselImgs: Array,
  detailImgs: Array,
  dimentionList: Array,
  propertyList: Array,
  skuInfoList: Array,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

ItemSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}
// db.articles.update({}, {$set: {flag: 1}}, {multi: 1})
module.exports = mongoose.model('Item', ItemSchema)
