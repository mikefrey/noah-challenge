var config = require('config')
var url = config.get('mongo.url')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// mongoose.connect(url)

var categorySchema = new Schema({
  abbr: String,
  name: String,
  availablePoints: Number,
  winners: [Schema.Types.ObjectId],
  position: Number,
  nominees: [{
    nomineeID: { type:Schema.Types.ObjectId, default: function() { return new mongoose.Types.ObjectId } },
    name: String,
    detail: String,
    position: Number
  }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
})

categorySchema.pre('save', function(next) {
  var now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})

var Category = module.exports = mongoose.model('Category', categorySchema)
