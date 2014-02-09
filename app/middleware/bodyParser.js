
var parse = require('co-body')

exports.json = function *(next) {
  this.data = yield parse.json(this.request)
  yield next
}

exports.form = function *(next) {
  this.data = yield parse.form(this.request)
  yield next
}
