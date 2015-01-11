var config = require('config')
var url = config.get('mongo.url')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var gameSchema = new Schema({
  name: String,
  eventDate: Number,
  locked: Boolean
})

var Game = module.exports = mongoose.model('Game', gameSchema)
