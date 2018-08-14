import mongoose from 'mongoose'
import path from 'path'
import os from 'os'
import fs from 'fs'
import formidable from 'formidable'
import md5 from 'md5'
import config from '../config'

const Merchant = mongoose.model('Merchant')

export const postMerchant = async(ctx,next) => {
  let body = ctx.request.body
  let { vendorName,serialNo,country,province,city,district,areaId,street,shopImgs,
      contactName,contactPhone,email,password,bank,bankAccountNo,swiftCode,benefName,taxName,taxNumber,taxImage} = body
  , sortlist = await Merchant.aggregate([{"$group":{"_id":null,"sort_max":{"$max":"$sort"}}}])
  body.sort = sortlist[0] ? sortlist[0].sort_max + 1 : 1
  if (!vendorName || !serialNo || !country || !province || !city || !areaId || !street || !shopImgs.length
      || !contactName || !contactPhone || !email || !password || !bank || !bankAccountNo || !swiftCode || !benefName || !taxName || !taxNumber || !taxImage) {
    return (ctx.body = {
      success: false,
      err: 'params Incomplete'
    })
  }
  body.password = md5(password)
  try {
    body = new Merchant(body)
    await body.save()
    ctx.body = {
      success: true,
      data: body
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
  
}

export const getCate = async(ctx,next) => {
  try {
    const data = await Category.find({ })
      .sort({'sort': 1})
      .exec()
    ctx.body = {
      success: true,
      data,
      total: data.length
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e,
      total: 0
    }
  }
}

export const updateCate = async(ctx,next) => {
  let body = ctx.request.body
  , {id, name} = body

  body.updateAt = Date.now()
  if(!id) {
    return (
      ctx.body = {
        success: false,
        err: 'category id required'
      }
    )
  }
  try{
    body = await Category.findByIdAndUpdate(id, body,{new:true}).exec()
    ctx.body = {
      success: true,
      data: body
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
}

export const sortCate = async(ctx,next) => {
  try{
    let cateList = ctx.request.body
    , cateListNew = await Promise.all(cateList.map(async(cate) => {
      let {id} = cate
      cate.updateAt = Date.now()
      return await Category.findByIdAndUpdate(id,cate,{new:true}).exec()
    })) 
    , data = await Category.find({ })
      .sort({'sort': 1})
      .exec()
    ctx.body = {
      success: true,
      data 
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
}

export const deleteCate = async(ctx, next) => {
  let { id } = ctx.params

  if (!id) {
    return (ctx.body = {
      success: false,
      err: 'id is required'
    })
  }

  try {
    let body = await Category.findByIdAndRemove(id).exec()
    ctx.body = {
      success: true,
      data: body
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
}