'use strict'

angular.module('oscars')
  .controller('BallotCtrl', function (BallotService, CategoryService, $q, $timeout) {

    function isNum(n) {
      return typeof n === 'number' && n === n
    }

    this.user = {
      _id: '52f66deeffb9d96e4b9a1717',
      firstName: 'Mike',
      lastName: 'Frey'
    }

    function getRemPoints(cat) {
      var pts = cat.nominees.reduce(function(p, nom) {
        return p + nom.points
      }, 0)
      return cat.availablePoints - pts
    }

    this.setPoints = function(cat, nom) {
      var pts = nom.points
      nom.points = parseInt(nom.newPoints||0, 10)
      var rem = getRemPoints(cat)
      if (rem < 0 || nom.points < 0 || !isNum(nom.points)) {
        nom.newPoints = pts || ''
        nom.points = pts
        rem = getRemPoints(cat)
      }
      if (cat.remaining != rem) {
        cat.remaining = rem
        this.delayedSave()
      }
    }

    var delayPromise
    this.delayedSave = function() {
      console.log('delayedSave')
      $timeout.cancel(delayPromise)
      delayPromise = $timeout(function() {
        console.log('saving')
        var votes = this.getVotes()
        var ballot = { _id: this.user._id, votes: votes }
        BallotService.update(ballot)
      }.bind(this), 2000)
    }

    this.getVotes = function() {
      var votes = []
      this.categories.forEach(function(cat) {
        cat.nominees.forEach(function(nom) {
          if (nom.points) {
            votes.push({
              nomineeID: nom.nomineeID,
              points: nom.points
            })
          }
        })
      })
      return votes
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
            nom.points = 0
            for (var i = 0; i < votes.length; i++) {
              var vote = votes[i]
              if (vote.nomineeID == nom.nomineeID) {
                nom.points = vote.points
                nom.newPoints = nom.points
                break
              }
            }
          })
          cat.remaining = getRemPoints(cat)
        })
        this.categories = cats
      }.bind(this))
    }

    this.load()

  })
