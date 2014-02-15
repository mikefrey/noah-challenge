"use strict"

var koa = require('koa')
var app = koa()

var staticFiles = require('koa-static')
var router = require('koa-router')
var views = require('koa-render')
var session = require('koa-session')

var logger = require('./app/middleware/logger')
var parseBody = require('./app/middleware/bodyParser')
var user = require('./app/middleware/user')
var loggedIn = require('./app/middleware/loggedIn')
var adminOnly = require('./app/middleware/adminOnly')

var config = require('./config')

app.keys = config.keys

app.use(logger)
app.use(session())
app.use(user)
app.use(staticFiles('./app/assets'))
app.use(views('./app/views', 'ejs'))
app.use(router(app))

// Users routes
var usersRoute = require('./app/routes/users')

app.get('/api/users', usersRoute.index)
app.post('/api/users', parseBody.json, usersRoute.create)
app.put('/api/users', parseBody.json, usersRoute.login)
app.get('/api/users/me', usersRoute.me)
app.put('/api/users/:id', parseBody.json, usersRoute.update)
app.del('/api/users/:id', usersRoute.destroy)

// Category Routes
var categoriesRoutes = require('./app/routes/categories')

app.get('/api/categories', categoriesRoutes.index)
app.post('/api/categories', parseBody.json, categoriesRoutes.create)
app.put('/api/categories/:id', parseBody.json, categoriesRoutes.update)
app.del('/api/categories/:id', categoriesRoutes.destroy)

// Ballot Routes
var ballotRoutes = require('./app/routes/ballots')

app.get('/api/ballots', ballotRoutes.index)
app.get('/api/ballots/:id', ballotRoutes.show)
app.put('/api/ballots/:id', parseBody.json, ballotRoutes.update)

// Catch-all home route
var homeRoute = require('./app/routes/home')
app.all('/404', function *(next) { this.status = 404; yield next }, homeRoute)
app.all('/', loggedIn, homeRoute)
app.all('/admin/*', adminOnly, homeRoute)
app.all('/login-error', homeRoute)
app.all('/register', homeRoute)
app.all('/*?', loggedIn, homeRoute)


app.listen(process.env.PORT || 3000)
