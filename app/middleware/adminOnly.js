module.exports = function *(next) {
  var isAdmin = this.user && this.user.admin

  if (!isAdmin) {
    console.log('redirecting logged out user to login')
    return this.redirect('/404')
  }

  yield next
}
