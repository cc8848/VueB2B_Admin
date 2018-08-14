import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import config from '../config'
const User = mongoose.model('User')
, Merchant = mongoose.model('Merchant')
, Admin = mongoose.model('Admin')

// ------------------------------------------------------------
// 权限管理分开写的原因是后期console、vendor、user的权限管理方式可能不同
// ------------------------------------------------------------

export const checkVendorToken = async(ctx, next) => {
  const token = ctx.get('token')
  console.log('vendor token \n',token)
  // console.log('cookie \n',ctx.cookies.get('token'))
  if (token) {

    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      console.log('decoded')
      console.log(decoded)
      const vendorEmail = decoded.vendorEmail
      , vendorId = decoded.vendorId
      , secret = config.jwt.secret
      let vendor = await Merchant.findOne({ _id: vendorId, email: vendorEmail }).exec()
      if (vendor && vendor._id && vendor.email) {
        ctx.vendorInfo = decoded
        await next()
      } else {
        return (ctx.body = {
          success: false,
          err: 'Token is invalid'
        })
      }
    } catch (e) {
      console.log(e.message)
      if(e.name === 'TokenExpiredError') {
        return (ctx.body = {
          success: false,
          err: 'Please login'
        }) 
      }
      return (ctx.body = {
        success: false,
        err: e
      })
    }
  } else {
    return (ctx.body = {
      success: false,
      err: 'Please login'
    })
  }
}

export const checkConsoleToken = async(ctx, next) => {
  const token = ctx.cookies.get('token')
  // console.log('cookie \n',ctx.cookies.get('token'))
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      console.log('decoded')
      console.log(decoded)
      const username = decoded.username
      , userID = decoded.userID
      , secret = config.jwt.secret
      let admin = await Admin.findOne({ _id: userID, username: username }).exec()
      if (admin && admin._id && admin.username) {
        ctx.consoleInfo = decoded
        await next()
      } else {
        return (ctx.body = {
          success: false,
          err: 'Please login'
        })
      }
    } catch (e) {
      console.log(e.message)
      if(e.name === 'TokenExpiredError') {
        return (ctx.body = {
          success: false,
          err: 'Please login'
        }) 
      }
      return (ctx.body = {
        success: false,
        err: e
      })
    }
  } else {
    return (ctx.body = {
      success: false,
      err: 'Please login'
    })
  }
}

export const checkUserToken = async(ctx, next) => {
  const token = ctx.get('token')
  if (token) {
    const decoded = jwt.verify(token, config.jwt.secret)
    console.log(decoded)
    const username = decoded.username
    const userID = decoded.userID
    try {
      let user = await User.findOne({ _id: userID, username: username }).exec()
      if (user && user._id && user.username) {
        ctx.userInfo = decoded
        await next()
      } else {
        return (ctx.body = {
          success: false,
          err: 'Please login'
        })
      }
    } catch (e) {
      console.log(e.message)
      return (ctx.body = {
        success: false,
        err: e
      })
    }
  } else {
    return (ctx.body = {
      success: false,
      err: 'Please login'
    })
  }
}
export const checkConsoleOrVendorToken = async(ctx, next) => {
  const token = ctx.cookies.get('token')
  // console.log('cookie \n',ctx.cookies.get('token'))
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      console.log('decoded')
      console.log(decoded)
      if(decoded.vendorEmail) {
        // ----------------------  vendor  ---------------------
        const vendorEmail = decoded.vendorEmail
        , vendorId = decoded.vendorId
        , secret = config.jwt.secret
        let vendor = await Merchant.findOne({ _id: vendorId, email: vendorEmail }).exec()
        if (vendor && vendor._id && vendor.email) {
          ctx.vendorInfo = decoded
          await next()
        } else {
          return (ctx.body = {
            success: false,
            err: 'Please login'
          })
        }
      } else if(decoded.username) {
        // ----------------------  console  ---------------------
        const username = decoded.username
        , userID = decoded.userID
        , secret = config.jwt.secret
        let console = await Admin.findOne({ _id: userID, username: username }).exec()
        if (console && console._id && console.username) {
          ctx.consoleInfo = decoded
          await next()
        } else {
          return (ctx.body = {
            success: false,
            err: 'Please login'
          })
        }
      } else {
        return (ctx.body = {
          success: false,
          err: 'Please login'
        })
      }
    } catch (e) {
      console.log(e.message)
      if(e.name === 'TokenExpiredError') {
        return (ctx.body = {
          success: false,
          err: 'Please login'
        }) 
      }
      return (ctx.body = {
        success: false,
        err: e
      })
    }
  } else {
    return (ctx.body = {
      success: false,
      err: 'Please login'
    })
  }
}
