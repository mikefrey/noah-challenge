var Game = require('../models/game')

module.exports = {

  index: function *(next) {
    var result = yield Game.findOne({}, 'id name eventDate locked').exec()
    this.body = result
  },

  create: function *(next) {
    var result = yield Game.create(this.data)
    this.body = result
  },

  update: function *(next) {
    var id = this.params.id

    delete this.data._id
    var result = yield Game.findByIdAndUpdate(id, this.data).exec()
    this.body = { _id:result._id }
  }

}
