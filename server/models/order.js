import mongoose from 'mongoose'
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    freight: Number,
    price: Number,
    totalQty: Number,
    totalType: Number,
    pointDeduct: Number,
    orderMessage: String,
    goodsInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    selectedSkuList: Array,
    statue: {
        type: Number,
        default: 1 // 0：订单取消、1 :等待支付、2：支付成功，等待发货、3：已发货、 4： 已收货、5、已完成、 6：物流失败、7：订单已废弃
    },
    sort: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

OrderSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}
// db.articles.update({}, {$set: {flag: 1}}, {multi: 1})
module.exports = mongoose.model('Order', OrderSchema)
