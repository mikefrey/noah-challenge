"use strict"

const koa = require('koa')
const app = koa()

const staticFiles = require('koa-static')
const views = require('koa-render')
const session = require('koa-session')

const logger = require('./app/middleware/logger')
const user = require('./app/middleware/user')

const config = require('config')
const router = require('./app/routes')

app.keys = config.get('keys')

app.use(logger)
app.use(session(config.get('session'), app))
app.use(staticFiles('./app/assets'))
app.use(views('./app/views', 'ejs'))

app.use(user)

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
