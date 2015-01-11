var config = require('config')
var url = config.get('mongo.url')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// mongoose.connect(url)

var categorySchema = new Schema({
  name: String,
  availablePoints: Number,
  winners: [Schema.Types.ObjectId],
  position: Number,
  nominees: [{
    nomineeID: { type:Schema.Types.ObjectId, default: function() { return new mongoose.Types.ObjectId } },
    name: String,
    detail: String,
    position: Number
  }]
})

var Category = module.exports = mongoose.model('Category', categorySchema)
