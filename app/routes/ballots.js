var Ballot = require('../models/ballot')

module.exports = {

  show: function *(next) {
    var id = this.params.id
    var result = yield Ballot.findById(id, 'id votes').exec()
    this.body = result
  },

  update: function *(next) {
    var id = this.params.id
    delete this.data._id
    var result = yield Ballot.findByIdAndUpdate(id, this.data).exec()
    this.body = { _id:result._id }
  }

}
