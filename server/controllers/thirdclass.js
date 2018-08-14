import mongoose from 'mongoose'
import path from 'path'
import os from 'os'
import fs from 'fs'

const Thirdclass = mongoose.model('Thirdclass')

export const postThirdclass = async(ctx,next) => {
  let {body} = ctx.request
  , {name, subclass, category} = body
  let thirdclassList = await Thirdclass.aggregate([{"$group":{"_id":null,"sort_max":{"$max":"$sort"}}}])
  console.log(thirdclassList)
  body.sort = thirdclassList[0] ? thirdclassList[0].sort_max + 1 : 1
  if (!name || !subclass || !category) {
    return (ctx.body = {
      success: false,
      err: 'thirdclass name , category or subclass is required'
    })
  }
  try{
    let newThird = new Thirdclass(body)
    await newThird.save()
    ctx.body = {
      success: true,
      data:newThird
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
}

export const patchThirdclass = async(ctx,next) => {
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
    let updateThirdclass = await Thirdclass.findByIdAndUpdate(id,body,{new: true}).exec()
    ctx.body = {
      success: true,
      data: updateThirdclass
    }
  } catch(err) {
    ctx.body = {
      success: false,
      err
    }
  }
} 

export const getThirdclass = async(ctx,next) => {
  let { subId:id } = ctx.params
  if(!id) {
    return (ctx.body = {
      success: false,
      err: 'param id is required'
    })
  }
  try{
    let data = await Thirdclass.find({subclass:id})
      .sort({'sort':1})
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

export const sortThirdclass = async(ctx,next) => {
  try{
    let {subclassList,category} = ctx.request.body
    let subclassListNew = await Promise.all(subclassList.map(async(cate) => {
      let {id} = cate
      cate.updateAt = Date.now()
      return await Thirdclass.findByIdAndUpdate({_id:id},cate,{new: true}).exec()
    })) 
    , data = await Thirdclass.find({category})
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

export const deleteThirdclass = async(ctx, next) => {
  let { id } = ctx.params

  if (!id) {
    return (ctx.body = {
      success: false,
      err: 'id is required'
    })
  }

  try {
    let body = await Thirdclass.findByIdAndRemove(id).exec()
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