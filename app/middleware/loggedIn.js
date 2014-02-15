module.exports = function *(next) {
  var id = this.user && this.user._id
  var isRoot = this.path == '/'

  console.log('id', id)
  console.log('isRoot', isRoot)

  if (!id && !isRoot) {
    console.log('redirecting logged out user to login')
    return this.redirect('/')
  }
  if (id && isRoot) {
    console.log('redirecting logged in user to ballot')
    return this.redirect('/ballot')
  }

  yield next
}
