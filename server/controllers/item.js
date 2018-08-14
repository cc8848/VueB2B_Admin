import mongoose from 'mongoose'
import path from 'path'
import os from 'os'
import fs from 'fs'
import formidable from 'formidable'

const Item = mongoose.model('Item')

export const postItem = async(ctx,next) => {
  let body = ctx.request.body
  let { category,subclass,thirdclass,name,brand,price,description,mainImg,carouselImgs,detailImgs,dimentionList,propertyList,skuInfoList } = body
  , itemList = await Item.aggregate([{"$group":{"_id":null,"sort_max":{"$max":"$sort"}}}])
  body.sort = itemList[0] ? itemList[0].sort_max + 1 : 1
  body.vendorId = ctx.vendorInfo.vendorId
  if (!category || !subclass || !thirdclass || !name || !brand || !price || !description || !mainImg || !carouselImgs || !detailImgs || !dimentionList || !propertyList || !skuInfoList) {
    return (ctx.body = {
      success: false,
      err: 'params Incomplete'
    })
  }

  try {
    body = new Item(body)
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

export const getItem = async(ctx,next) => {
  let { id } = ctx.params
  if(!id) {
    return (ctx.body = {
      success: false,
      err: 'param id is required'
    })
  }
  try{
    let data = await Item.findOne({ _id: id })
      .exec()
    ctx.body = {
      success: true,
      data: data 
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
}

export const getItemList = async(ctx,next) => {
  let { subclass,thirdclass } = ctx.request.body
  // let itemList = await Item.find({})
  // itemList.forEach(async item => {
  //   await Item.findByIdAndUpdate(item._id,{subclass: mongoose.Types.ObjectId('5ad990a255bc8a6cb0ac000a')})
  // })
  if(!subclass && !thirdclass) {
    return (ctx.body = {
      success: false,
      err: 'params illegal, need subclass or thirdclass id'
    })
  } else if(subclass) {
    console.log('sub now',subclass)
    try {
      let list = await Item.find({subclass,passStatus:'passed'}).exec()
      ctx.body = {
        success: true,
        data: list 
      }
    } catch(err) {
      ctx.body = {
        success: false,
        err
      }
    }

  } else if(thirdclass) {
    try {
      let list = await Item.find({thirdclass,passStatus:'passed'}).exec()
      ctx.body = {
        success: true,
        data: list 
      }
    } catch(err) {
      ctx.body = {
        success: false,
        err
      }
    }
  }
}

export const getApplying = async(ctx,next) => {
  let vendorId = ctx.vendorInfo.vendorId
  console.log(typeof vendorId,vendorId, mongoose.Types.ObjectId(vendorId) === mongoose.Types.ObjectId(vendorId))
  try{
    let data = await Item.find({ vendorId}) //, passStatus: {$in: ['passed','review','reject']}
      .exec()
    ctx.body = {
      success: true,
      data: data || 'not find'
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
}

export const getReview = async(ctx,next) => {
  try{
    let data = await Item.find({ passStatus: 'review' })
      .populate('vendorId','vendorName')
      .exec()
    ctx.body = {
      success: true,
      data 
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
}

export const patchItem = async(ctx,next) => {
  let { id } = ctx.params
  , {body} = ctx.request
  // ----------------------  id存在，更新item  ---------------------
  if(!id) { 
    return (ctx.body = {
      success: false,
      err: 'item id is required'
    })
  } 

  try{
    let updateItem = await Item.findByIdAndUpdate(id,body,{new: true}).exec()
    ctx.body = {
      success: true,
      data: updateItem
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
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