var Ballot = require('../models/ballot')

module.exports = {

  index: function *(next) {
    var result = yield Ballot.find('id firstName lastName votes').exec()
    this.body = result
  },

  show: function *(next) {
    var id = this.params.id
    var result = yield Ballot.findById(id, 'id votes').exec()
    this.body = result
  },

  update: function *(next) {
    var uid = this.user && this.user._id
    var id = this.params.id

    if (!uid || uid != id) return this.status = 401

    delete this.data._id
    var result = yield Ballot.findByIdAndUpdate(id, this.data).exec()
    this.body = { _id:result._id }
  }

}
