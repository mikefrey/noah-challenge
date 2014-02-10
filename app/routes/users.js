var Ballot = require('../models/ballot')

module.exports = {

  index: function *(next) {
    var fields = 'id firstName lastName'
    if (true || this.session.admin === true)
      fields += ' email admin'
    var users = yield Ballot.find({}, fields).exec()
    this.body = users
  },

  login: function *(next) {
    var id = this.data.id
    var pw = this.data.pw
    var result = yield Ballot.findById(id, 'id').where('password', pw).exec()

    if (result && id == result._id) {
      this.session.uid = id
      this.body = result
    } else {
      this.body = {}
    }
  },

  create: function *(next) {
    var result = yield Ballot.create(this.data)
    if (result) {
      this.session.uid = result._id
    }
    this.body = result
  },

  update: function *(next) {
    var id = this.params.id
    delete this.data._id
    var result = yield Ballot.findByIdAndUpdate(id, this.data).exec()
    this.body = { _id:result._id }
  },

  destroy: function *(next) {
    var id = this.params.id
    var result = yield Ballot.findByIdAndRemove(id).exec()
    this.body = { _id:result._id }
  }

}
