'use strict'

angular.module('oscars')
  .controller('BallotCtrl', function (BallotService, CategoryService, $q) {

    this.user = {
      _id: '52f66deeffb9d96e4b9a1717',
      firstName: 'Mike',
      lastName: 'Frey'
    }

    this.getRemPoints = function(cat) {
      var pts = cat.nominees.reduce(function(p, nom) {
        return p + (parseInt(nom.points, 10) || 0)
      }, 0)
      return cat.availablePoints - pts
    }

    this.setPoints = function(cat, nom) {
      var rem = this.getRemPoints(cat)
      if (rem < 0) {
        nom.points = 0
        rem = this.getRemPoints(cat)
      }
      cat.remaining = rem
    }

    this.load = function() {
      var p = {
        cats: CategoryService.list(),
        ballot: BallotService.find(this.user._id)
      }
      $q.all(p).then(function(res) {
        var cats = res.cats
        var votes = res.ballot.votes || []
        cats.forEach(function (cat) {
          cat.remaining = cat.availablePoints
          cat.nominees.forEach(function(nom) {
            for (var i = 0; i < votes.length; i++) {
              var vote = votes[i]
              if (vote.nomineeID == nom.nomineeID) {
                nom.points = vote.points
                break
              }
            }
          })
        })
        this.categories = cats
      }.bind(this))
    }

    this.load()

  })
