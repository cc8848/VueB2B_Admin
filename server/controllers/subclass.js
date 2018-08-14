import mongoose from 'mongoose'
import path from 'path'
import os from 'os'
import fs from 'fs'

const Subclass = mongoose.model('Subclass')
, Thirdclass = mongoose.model('Thirdclass')
, Item = mongoose.model('Item')

export const postSubclass = async(ctx,next) => {
  let { id } = ctx.params
  , {body} = ctx.request
  , {name, img, category} = body
  let subclassList = await Subclass.aggregate([{"$group":{"_id":null,"sort_max":{"$max":"$sort"}}}])
  body.sort = subclassList[0] ? subclassList[0].sort_max + 1 : 1
  if (!name || !img || !category) {
    return (ctx.body = {
      success: false,
      err: 'subclass name or img or category is required'
    })
  }
  try{
    let newSub = new Subclass(body)
    await newSub.save()
    ctx.body = {
      success: true,
      data:newSub
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
}

export const patchSubclass = async(ctx,next) => {
  let { id } = ctx.params
  , {body} = ctx.request
  // ----------------------  id存在，更新subclass  ---------------------
  if(!id) { 
    return (ctx.body = {
      success: false,
      err: 'subclass id is required'
    })
  } 

  try{
    let updateSubclass = await Subclass.findByIdAndUpdate(id,body,{new: true}).exec()
    ctx.body = {
      success: true,
      data: updateSubclass
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
} 

export const getSubclass = async(ctx,next) => {
  let { id } = ctx.params
  if(!id) {
    return (ctx.body = {
      success: false,
      err: 'param id is required'
    })
  }
  try{
    let data = await Subclass.find({category:[id]})
      .populate('category','name')
      .sort({'sort':1})
      .exec()
    let subData = await Promise.all(
      data.map(async sub => {
        sub.thirdclass = await Thirdclass.find({subclass:sub._id})
        return sub
      })
    ) 
    ctx.body = {
      success: true,
      data:subData,
      total: data.length
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
}

export const sortSubclass = async(ctx,next) => {
  try{
    let {subclassList,category} = ctx.request.body
    let subclassListNew = await Promise.all(subclassList.map(async(cate) => {
      let {id} = cate
      cate.updateAt = Date.now()
      return await Subclass.findByIdAndUpdate({_id:id},cate,{new: true}).exec()
    })) 
    , data = await Subclass.find({category})
      .sort({'sort': 1})
      .exec()
    ctx.body = {
      success: true,
      data 
    }
  } catch (e) {
    console.log(e.message)
    ctx.body = {
      success: false,
      err: e.message
    }
  }
}

export const deleteSubclass = async(ctx, next) => {
  let { id } = ctx.params

  if (!id) {
    return (ctx.body = {
      success: false,
      err: 'id is required'
    })
  }

  try {
    let body = await Subclass.findByIdAndRemove(id).exec()
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