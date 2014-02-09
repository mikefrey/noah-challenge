"use strict"

var koa = require('koa')
var app = koa()

var staticFiles = require('koa-static')
var router = require('koa-router')
var views = require('koa-render')
var session = require('koa-session')
var parseBody = require('./app/middleware/bodyParser')

var config = require('./config')

// routes
var usersRoute = require('./app/routes/users')

app.keys = config.keys

// logger
app.use(function *(next) {
  var start = new Date
  yield next
  var ms = new Date - start
  var sc = this.status || '404?'
  console.log('%s %s - %s - %s', this.method, this.url, sc, ms)
})

app.use(session())

app.use(staticFiles('./public'))
app.use(views('./app/views', 'ejs'))
app.use(router(app))

app.get('/api/users', usersRoute.index)
app.post('/api/users', parseBody.json, usersRoute.create)
app.put('/api/users', parseBody.json, usersRoute.login)

app.get('/*?', require('./app/routes/home'))


app.listen(process.env.PORT || 3000)
