module.exports = function *(next) {
  if (this.path == '/') this.redirect('/ballot')
  this.body = yield this.render('home', { me:this.user })
}
