var Ballot = require('../models/ballot')
var Category = require('../models/category')
var _ = require('underscore')

module.exports = function *(next) {
  var id = this.params.id
  var b = Ballot.findById(id, 'firstName lastName email votes').exec()
  var c = Category.find().exec()

  var ballot = JSON.parse(JSON.stringify(yield b))
  var cats = JSON.parse(JSON.stringify(yield c))
  var votes = ballot.votes



  ballot.points = []
  cats.forEach(function(cat) {
    cat.nominees = cat.nominees || []
    // set points on each nominee
    cat.nominees.forEach(function(nom) {
      nom.points = 0

      for (var i = 0; i < votes.length; i++) {
        var vote = votes[i]
        if (vote.nomineeID == nom.nomineeID) {
          nom.points = vote.points
          break
        }
      }
    })

    // if there are no winners, just zero the category
    if (!cat.winners || !cat.winners.length) {
      cat.score = 0
      return ballot.points.push(0)
    }

    // figure out total points for the category
    var points = cat.winners.reduce(function(p, w) {
      var vote = _.findWhere(ballot.votes, {nomineeID:w})
      if (!vote) return p
      return p + vote.points
    }, 0)
    ballot.points.push(points || 0)
    cat.score = points
  })

  ballot.score = ballot.points.reduce(function(t, p) { return t + p }, 0)



  var csv = `${ballot.firstName} ${ballot.lastName}
${ballot.email}
${ballot.score}

`

  cats.forEach(function(cat) {
    csv += `${cat.score},${cat.name}\n`
    cat.nominees.forEach(function(nom) {
      csv += `${nom.points},${nom.name}\n`
    })
    csv += '\n'
  })

  var filename = ballot.firstName+ballot.lastName+'.csv'
  this.set('Content-Disposition', 'attachment; filename="'+filename+'"')
  this.set('Content-Type', 'text/csv')
  this.body = csv
}
