module.exports = function *(next) {
  this.body = yield this.render('home')
}
