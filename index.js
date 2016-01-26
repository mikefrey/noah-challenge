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

var config = require('config')

app.keys = config.get('keys')

app.use(logger)
app.use(session(app))
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
app.del('/api/users/:id', adminOnly, usersRoute.destroy)

// Password routes
var passwordRoute = require('./app/routes/password')

app.post('/api/password', parseBody.json, passwordRoute.forgot)
app.put('/api/password', parseBody.json, passwordRoute.reset)

// Category Routes
var categoriesRoutes = require('./app/routes/categories')

app.get('/api/categories', categoriesRoutes.index)
app.post('/api/categories', adminOnly, parseBody.json, categoriesRoutes.create)
app.put('/api/categories/:id', adminOnly, parseBody.json, categoriesRoutes.update)
app.del('/api/categories/:id', adminOnly, categoriesRoutes.destroy)

// Ballot Routes
var ballotRoutes = require('./app/routes/ballots')

app.get('/api/ballots', ballotRoutes.index)
app.get('/api/ballots/:id', ballotRoutes.show)
app.put('/api/ballots/:id', parseBody.json, ballotRoutes.update)

// games routes
var gamesRoutes = require('./app/routes/games')

app.get('/api/games', gamesRoutes.index)
app.post('/api/games', adminOnly, parseBody.json, gamesRoutes.create)
app.put('/api/games/:id', adminOnly, parseBody.json, gamesRoutes.update)

var logoutRoute = require('./app/routes/logout')
app.all('/logout', logoutRoute)

var exportRoute = require('./app/routes/export')
app.all('/export/:id', exportRoute)

var videoRoute = require('./app/routes/video')
app.get('/video/oscars-2015.mp4', videoRoute)

// Catch-all home route
var homeRoute = require('./app/routes/home')
app.all('/404', function *(next) { this.status = 404; yield next }, homeRoute)
app.all('/', loggedIn, homeRoute)
app.all(/\/admin\/[\w\d]*/i, adminOnly, homeRoute)
app.all('/forgot-password', homeRoute)
app.all('/reset-password', homeRoute)
app.all('/login-error', homeRoute)
app.all('/howtoplay', homeRoute)
app.all('/register', homeRoute)
app.all('/*?', loggedIn, homeRoute)
app.all(/\/[\w\d]*/, loggedIn, homeRoute)


app.listen(process.env.PORT || 3000)
