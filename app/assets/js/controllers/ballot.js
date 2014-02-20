'use strict'

angular.module('oscars')
  .controller('BallotCtrl', function (MeProvider, BallotService, CategoryService, $routeParams, $q, $timeout, $location) {

    function isNum(n) {
      return typeof n === 'number' && n === n
    }

    // determine points remaining for the given category
    function getRemPoints(cat) {
      var pts = cat.nominees.reduce(function(p, nom) {
        return p + nom.points
      }, 0)
      return cat.availablePoints - pts
    }

    // validate points and totals and set points remaining
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

    // delay ballot save by a moment or so to
    // give the user a chance to do a bit more
    var delayPromise
    this.delayedSave = function() {
      $timeout.cancel(delayPromise)
      delayPromise = $timeout(function() {
        var votes = this.getVotes()
        var ballot = { _id: this.ballot._id, votes: votes }
        BallotService.update(ballot)
      }.bind(this), 2000)
    }

    // get a list of all the user's allocated
    // points across all categories
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

    // tally the total score for the ballot
    function tallyBallot(ballot, cats) {
      ballot.points = []
      cats.forEach(function(cat) {
        if (!cat.winners || !cat.winners.length)
          return ballot.points.push(0)

        var points = cat.winners.reduce(function(p, w) {
          var vote = _.findWhere(ballot.votes, {nomineeID:w})
          if (!vote) return p
          return p + vote.points
        }, 0)
        ballot.points.push(points || 0)
      })

      ballot.score = ballot.points.reduce(function(t, p) { return t + p }, 0)
    }

    // load the categories and ballot
    // merge the data so that the user's scores
    // are on each nominee
    this.load = function() {
      var id = this.user._id
      if ($routeParams.uid && this.user.admin) {
        id = $routeParams.uid
      }

      var p = {
        cats: CategoryService.list(),
        ballot: BallotService.find(id)
      }
      $q.all(p).then(function(res) {
        var cats = res.cats
        var ballot = res.ballot
        var votes = ballot.votes || []

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

        tallyBallot(ballot, cats)

        this.categories = cats
        this.ballot = ballot
      }.bind(this),
      function() {
        console.log('something failed')
      })
    }

    // load the uesr, then the data!
    MeProvider.then(function() {
      this.user = MeProvider
      if (this.user) return this.load()
      $location.path('/')
    }.bind(this))


  })
