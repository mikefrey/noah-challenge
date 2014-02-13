var Category = require('../models/category')

module.exports = {

  index: function *(next) {
    var categories = yield Category.find({}).sort({position:'asc'}).exec()
    this.body = categories
  },

  create: function *(next) {
    var result = yield Category.create(this.data)
    this.body = result
  },

  update: function *(next) {
    var id = this.params.id
    delete this.data._id
    var result = yield Category.findByIdAndUpdate(id, this.data).exec()
    this.body = { _id:result._id }
  },

  destroy: function *(next) {
    var id = this.params.id
    var result = yield Category.findByIdAndRemove(id).exec()
    this.body = { _id:result._id }
  }

}
