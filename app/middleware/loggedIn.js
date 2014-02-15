var Ballot = require('../models/ballot')

module.exports = function *(next) {
  console.log('USER', this.user)
  if (!this.user || this.user._id)
    this.redirect('/')
  yield next
}