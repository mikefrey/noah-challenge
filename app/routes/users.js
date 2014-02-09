var Ballot = require('../models/ballot')

function execQuery(query) {
  return function(fn) {
    query.exec(function(err, data) {
      if (err) console.error(err)
      fn(err, data)
    })
  }
}

module.exports = {

  index: function *(next) {
    var users = yield execQuery(Ballot.find({}, 'id firstName lastName'))
    this.body = users
  },

  login: function *(next) {
    var id = this.data.id
    var pw = this.data.pw
    var result = yield execQuery(Ballot.findById(id, 'id').where('password', pw))

    if (result && id == result._id) {
      this.body = result
    } else {
      this.body = {}
    }
  },

  create: function *(next) {
    var result = yield Ballot.create(this.data)
    this.body = result
  },

  // update: function *(next) {

  // }

}
