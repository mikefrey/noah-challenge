var Ballot = require('../models/ballot')

module.exports = function *(next) {
  if (!this.user || !this.user._id) {
    console.log('redirecting logged out user to login')
    return this.redirect('/')
  } else if (this.path == '/') {
    console.log('redirecting logged in user to ballot')
    this.redirect('/ballot')
  }
  yield next
}
