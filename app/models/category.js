var config = require('../../config')
var url = config.mongo.url
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// mongoose.connect(url)

var categorySchema = new Schema({
  name: String,
  availablePoints: Number,
  winners: [Schema.Types.ObjectId],
  options: [{
    optionID: Schema.Types.ObjectId,
    name: String
  }]
})

var Category = module.exports = mongoose.model('Category', categorySchema)
