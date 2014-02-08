var koa = require('koa')
var staticFiles = require('koa-static')
var app = koa()

var router = require('koa-router')
var views = require('koa-render')



// logger
app.use(function *(next) {
  var start = new Date
  yield next
  var ms = new Date - start
  var sc = this.status || '404?'
  console.log('%s %s - %s - %s', this.method, this.url, sc, ms)
})

app.use(staticFiles('./public'))
app.use(views('./app/views', 'ejs'))
app.use(router(app))

app.get('/api/users', require('./app/routes/users').index)

app.get('/', require('./app/routes/home'))


app.listen(process.env.PORT || 3000)
