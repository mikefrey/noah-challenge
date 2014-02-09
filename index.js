"use strict"

var koa = require('koa')
var app = koa()

var staticFiles = require('koa-static')
var router = require('koa-router')
var views = require('koa-render')
var session = require('koa-session')
var parseBody = require('./app/middleware/bodyParser')

var config = require('./config')


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

// Users routes
var usersRoute = require('./app/routes/users')

app.get('/api/users', usersRoute.index)
app.post('/api/users', parseBody.json, usersRoute.create)
app.put('/api/users', parseBody.json, usersRoute.login)
app.put('/api/users/:id', parseBody.json, usersRoute.update)
// app.del('/api/users/:id', usersRoute.destroy)
app['delete']('/api/users/:id', usersRoute.destroy)


// Catch-all home route
app.get('/*?', require('./app/routes/home'))


app.listen(process.env.PORT || 3000)
