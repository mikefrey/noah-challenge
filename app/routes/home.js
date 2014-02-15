module.exports = function *(next) {
  if (this.path == '/' && this.user && this.user._id) {
    console.log('redirecting logged in user to ballot')
    this.redirect('/ballot')
  }
  this.body = yield this.render('home', { me:this.user })
}
