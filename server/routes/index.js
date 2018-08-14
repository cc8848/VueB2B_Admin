import Router from 'koa-router'
import config from '../config'
import db from '../models'
import {checkUserToken,checkVendorToken,checkConsoleToken,checkConsoleOrVendorToken} from '../middlewares/check-token'
const router = new Router({
  prefix: config.app.routerBaseApi
})

const user = require('../controllers/user')
, tag = require('../controllers/tag')
, article = require('../controllers/article')

const cateCtl = require('../controllers/category')
, uploadCtl = require('../controllers/upload')
, subclassCtl = require('../controllers/subclass')
, thirdclassCtl = require('../controllers/thirdclass')
, itemCtl = require('../controllers/item')         
, merchantCtl = require('../controllers/merchant')
, orderCtl = require('../controllers/order')

router
  .get('/test', async(ctx,next) => {

  })

router
  .get('/tags/:id?', tag.getTagsOrArticles)
  .post('/tag', checkUserToken, tag.postTag)
  .patch('/tag', checkUserToken, tag.patchTag)
  .del('/tag/:id?', checkUserToken, tag.deleteTag)

router
  .get('/search/:keyword?', article.search)
  .get('/article/:id?', article.getArticle)
  .get('/articles/:page?/:limit?', article.getArticles)
  .get('/private-articles', checkUserToken, article.getPrivateArticles)
  .get('/archives', article.archives)
  .post('/article', checkUserToken, article.postArticle)
  .post('/upload', checkUserToken, article.upload)
  .patch('/article', checkUserToken, article.patchArticle)
  .del('/article/:id?', checkUserToken, article.deleteArticle)

// ----------------------  登录|权限  ---------------------
router
  .get('/user', user.getUserInfo)
  .patch('/user', checkUserToken, user.patchUserInfo)
  .post('/console_login', user.consoleLogin)
  .post('/vendor_login',user.vendorLogin)
  .post('/login',user.userLogin)
  .post('/logout', checkUserToken, user.logout)

// ----------------------  大类  ---------------------
router
  .post('/category', checkConsoleToken, cateCtl.postCate)
  .get('/category', cateCtl.getCate)
  .post('/category/sort', checkConsoleToken, cateCtl.sortCate)
  .patch('/category/:id?', checkConsoleToken, cateCtl.patchCate)
  .del('/category/:id?', checkConsoleToken, cateCtl.deleteCate)

// ----------------------  小类  ---------------------
router
  .post('/img/upload',uploadCtl.postImg)
  .get('/subclass/:id?',subclassCtl.getSubclass)
  .post('/subclass', checkConsoleToken, subclassCtl.postSubclass)
  .patch('/subclass/:id?', checkConsoleToken, subclassCtl.patchSubclass)
  .del('/subclass/:id?', checkConsoleToken, subclassCtl.deleteSubclass)
  .post('/subclass/sort', checkConsoleToken, subclassCtl.sortSubclass)

  // ----------------------  三级分类  ---------------------
router
  .get('/thirdclass/:subId?',thirdclassCtl.getThirdclass)
  .post('/thirdclass', checkConsoleToken, thirdclassCtl.postThirdclass)
  .patch('/thirdclass/:id?', checkConsoleToken, thirdclassCtl.patchThirdclass)
  .del('/thirdclass/:id?', checkConsoleToken, thirdclassCtl.deleteThirdclass)

// ----------------------  商品  ---------------------
router
  .post('/item/create', checkVendorToken, itemCtl.postItem)
  .get('/item/applying', checkVendorToken, itemCtl.getApplying)
  .get('/item/reviewlist', checkConsoleToken, itemCtl.getReview)
  .get('/item/:id?',itemCtl.getItem)
  .post('/items',itemCtl.getItemList)
  .patch('/item/:id?',checkConsoleToken,itemCtl.patchItem)

// ----------------------  商户  ---------------------
router
  .post('/merchant/create', merchantCtl.postMerchant)

// ----------------------  订单  ---------------------
router
  .post('/order/create',checkUserToken,orderCtl.postOrder)


export default router
