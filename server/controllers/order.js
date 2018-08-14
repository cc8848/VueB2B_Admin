import mongoose from 'mongoose'
import path from 'path'
import os from 'os'
import fs from 'fs'
import formidable from 'formidable'

const Order = mongoose.model('Order')

export const postOrder = async(ctx,next) => {
  let body = ctx.request.body
  console.log(body)
  let { vendor,address,freight,price,totalQty,totalType,pointDeduct,orderMessage,goodsInfo,selectedSkuList } = body
  , list = await Order.aggregate([{"$group":{"_id":null,"sort_max":{"$max":"$sort"}}}])
  body.sort = list[0] ? list[0].sort_max + 1 : 1
  body.user = ctx.userInfo.userID
  if (!vendor || !address || typeof freight === undefined || typeof totalType === undefined || typeof totalQty === undefined || typeof price === undefined || typeof pointDeduct === undefined || typeof orderMessage === undefined || !goodsInfo || !selectedSkuList.length ) {
    return (ctx.body = {
      success: false,
      err: 'params Incomplete'
    })
  }

  try {
    body = new Order(body)
    let newOrder = await body.save()
    ctx.body = {
      success: true,
      data: newOrder
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
  
}
