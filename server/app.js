import Koa from 'koa'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import cors from '@koa/cors'
import globalConfig from './config'
import route from './routes'

const app = new Koa()
const router = new Router()


app.use(cors())
app.use(bodyParser())
app.use(KoaStatic('.'))
router.use('', route.routes())
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8088, '0.0.0.0') 
console.log('Server listening on ' + '0.0.0.0:' + 8088) // eslint-disable-line no-console 
