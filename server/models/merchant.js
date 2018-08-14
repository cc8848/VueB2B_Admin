import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MerchantSchema = new Schema({
  id: Number,
  vendorName: String,
  serialNo: Number,
  country: Number,
  province: String,
  city: String,
  district: String,
  areaId: Number,
  street: String,
  taxImage: String,
  shopImgs: Array,
  contactName: String,
  contactPhone: String,
  email: String,
  password: String,
  bank: String,
  bankAccountNo: String,
  swiftCode: String,
  benefName: String,
  taxName: String,
  taxNumber: String,
  passStatus: {
    type: String,
    default: 'review'
  }, // 'passed','review','redject'
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

MerchantSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
  }
}
// db.articles.update({}, {$set: {flag: 1}}, {multi: 1})
mongoose.model('Merchant', MerchantSchema)
