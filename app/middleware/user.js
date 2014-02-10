var Ballot = require('../models/ballot')

module.exports = function *(next) {
  var id = this.session.uid
  if (id) {
    var user = yield Ballot.findById(id, 'id firstName lastName admin').exec()
    this.user = user
  }
  yield next
}
