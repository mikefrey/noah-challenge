const router = module.exports = require('koa-router')()

const parseBody = require('../middleware/bodyParser')
const loggedIn = require('../middleware/loggedIn')
const adminOnly = require('../middleware/adminOnly')

// Auth routes
const authRoute = require('./auth')

router.post('/api/users', parseBody.json, authRoute.signup)
router.put('/api/users', parseBody.json, authRoute.login)
router.all('/logout', authRoute.logout)

// Users routes
const usersRoute = require('./users')

router.get('/api/users', usersRoute.index)
router.get('/api/users/me', usersRoute.me)
router.put('/api/users/:id', parseBody.json, usersRoute.update)
router.del('/api/users/:id', adminOnly, usersRoute.destroy)

// Password routes
const passwordRoute = require('./password')

router.post('/api/password', parseBody.json, passwordRoute.forgot)
router.put('/api/password', parseBody.json, passwordRoute.reset)

// Category Routes
const categoriesRoutes = require('./categories')

router.get('/api/categories', categoriesRoutes.index)
router.post('/api/categories', adminOnly, parseBody.json, categoriesRoutes.create)
router.put('/api/categories/:id', adminOnly, parseBody.json, categoriesRoutes.update)
router.del('/api/categories/:id', adminOnly, categoriesRoutes.destroy)

// Ballot Routes
const ballotRoutes = require('./ballots')

router.get('/api/ballots', ballotRoutes.index)
router.get('/api/ballots/:id', ballotRoutes.show)
router.put('/api/ballots/:id', parseBody.json, ballotRoutes.update)
router.del('/api/ballots/:id', ballotRoutes.clear)

// games routes
const gamesRoutes = require('./games')

router.get('/api/games', gamesRoutes.index)
router.post('/api/games', adminOnly, parseBody.json, gamesRoutes.create)
router.put('/api/games/:id', adminOnly, parseBody.json, gamesRoutes.update)


const exportRoute = require('./export')
router.all('/export/:id', exportRoute)

const videoRoute = require('./video')
router.get('/video/oscars-2016.mp4', videoRoute)

// Catch-all home route
const homeRoute = require('./home')
router.all('/404', function *(next) { this.status = 404; yield next }, homeRoute)
router.all('/', loggedIn, homeRoute)
router.get(/\/admin\/[\w\d]*/i, adminOnly, homeRoute)
router.all('/forgot-password', homeRoute)
router.all('/reset-password', homeRoute)
router.all('/login-error', homeRoute)
router.all('/howtoplay', homeRoute)
router.get('/register', homeRoute)
router.get('/*?', loggedIn, homeRoute)
router.get(/^\/(?!api)[\w\d]+$/, loggedIn, homeRoute)
