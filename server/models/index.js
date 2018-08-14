import mongoose from 'mongoose'
import md5 from 'md5'
import config from '../config'

export default {
  Tag : require('./tag'),
  Artical : require('./article'),

  User : require('./user'),
  Adim : require('./admin'),

  Category : require('./category'),
  Subclass : require('./subclass'),
  Thirdclass : require('./thirdclass'),
  Item : require('./item'),
  Merchant : require('./merchant'),
  Order: require('./order')
}

const Admin = mongoose.model('Admin')
, User = mongoose.model('User')

const mongoUrl = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`
mongoose.Promise = global.Promise
mongoose.connection
  .openUri(mongoUrl)
  .once('open', async () => {
    console.log('database connect successed')

    // ----------------------  创建管理员  ---------------------
    let adminInfo = config.admin
    adminInfo.password = md5(adminInfo.password)
    let admin = await Admin.findOne({ role: 'superAdmin' }).exec()
    if (!admin) {
      admin = new Admin(adminInfo)
      await admin.save()
      console.log('Administrator information initialization succeeded')
    }

    // ----------------------  创建普通商城用户  ---------------------
    let userInfo = config.user
    userInfo.password = md5(userInfo.password)
    let user = await User.findOne({role: 'user'}).exec()
    if(!user) {
      user = new User(userInfo)
      await user.save()
      console.log('User information initialization succeeded')
    }

  })
  .on('error', (error) => {
    console.warn('database connect fail', error)
  }) 
