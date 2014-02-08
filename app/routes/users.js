var Ballot = require('../models/ballot')

function execQuery(query) {
  return function(fn) {
    query.exec(fn)
  }
}

module.exports = {

  index: function *(next) {
    var users = yield execQuery(Ballot.find({}, 'id firstName lastName'))
    this.body = users
  },

  create: function *(next) {

  },

  update: function *(next) {

  }

}
