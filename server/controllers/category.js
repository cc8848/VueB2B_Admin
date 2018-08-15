import mongoose from 'mongoose'
import path from 'path'
import os from 'os'
import fs from 'fs'
import formidable from 'formidable'

const Category = mongoose.model('Category')

export const postCate = async(ctx,next) => {
  let body = ctx.request.body
  let { name, imgUri, parentId } = body
  , cateList = await Category.aggregate([{"$group":{"_id":null,"sort_max":{"$max":"$sort"}}}])
  body.sort = cateList[0] ? cateList[0].sort_max + 1 : 1
  if (!name) {
    return (ctx.body = {
      success: false,
      err: 'category name is required'
    })
  }

  try {
    if(parentId) {
      // ----------------------  当添加子类  ---------------------
      let pCate = await Category.findById(parentId)
      if (pCate) {
        let newCate = new Category(body)
        await newCate.save()
        pCate.children.push(newCate)
        body = await Category.findByIdAndUpdate(parentId,{children: pCate.children})
        ctx.body = {
          success: true,
          data: body
        }
      } else {
        ctx.body = {
          success: false,
          data: 'Not invalid parentId'
        }
      }
    } else {
      body.isRoot = true
      console.log(body,'body')
      body = new Category(body)
      let res = await body.save()
      console.log(res,'res')
      ctx.body = {
        success: true,
        data: res
      }
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
    let data = await Category.find({isRoot: true })
      .sort({'sort': 1})
      .populate({
        path:'children',
        populate:{
          path: 'children'
        }
      })
      .find({isRoot: true})
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

export const patchCate = async(ctx,next) => {
  let body = ctx.request.body
  , { id } = ctx.params
  console.log(1235)
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
      err: e.message
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
    console.log(e.message)
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