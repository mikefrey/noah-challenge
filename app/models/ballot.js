var config = require('../../config')
var url = config.mongo.url
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect(url)

var ballotSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: { type: Boolean, default: false },
  votes: [{
    nomineeID: Schema.Types.ObjectId,
    points: Number
  }]
})

ballotSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
})

var Ballot = module.exports  = mongoose.model('Ballot', ballotSchema)
