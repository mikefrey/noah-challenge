var _ = require('underscore')
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
    // var result = yield Category.findByIdAndUpdate(id, this.data).exec()
    // Can't use findByIdAndUpdate here because the pre save hook won't run
    var cat = yield Category.findById(id).exec()
    _.extend(cat, _.omit(this.data, '_id'))
    var result = yield cat.save.bind(cat)
    this.body = { _id:result[0]._id }
  },

  destroy: function *(next) {
    var id = this.params.id
    var result = yield Category.findByIdAndRemove(id).exec()
    this.body = { _id:result._id }
  }

}
