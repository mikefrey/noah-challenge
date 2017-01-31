"use strict"

const config = require('config')
const mongoose = require('mongoose')
const koa = require('koa')
const staticFiles = require('koa-static')
const views = require('koa-render')
const session = require('koa-session')

const logger = require('./app/middleware/logger')
const user = require('./app/middleware/user')
const router = require('./app/routes')

const mongoUrl = config.get('mongo.url')
console.log('MONGOURL', mongoUrl)
mongoose.set('debug', true)
mongoose.connect(mongoUrl)

const app = koa()

app.keys = config.get('keys')

app.use(logger)
app.use(session(config.get('session'), app))
app.use(staticFiles('./app/assets'))
app.use(views('./app/views', 'ejs'))

app.use(user)

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT || 3000)
