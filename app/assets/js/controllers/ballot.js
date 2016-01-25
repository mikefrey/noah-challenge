'use strict'

angular.module('oscars')
  .controller('BallotCtrl', function ($scope, MeProvider, BallotService, CategoryService, GameService, $routeParams, $q, $timeout, $location) {

    $scope.$on('$locationChangeStart', function(event, next, current) {
      if (this.game.locked) return
      var cats = this.categories
      for (var i = 0; i < cats.length; i++) {
        if (getRemPoints(cats[i]) > 0) {
          var answer = confirm('You still have unallocated points, are you sure you want to leave?')
          if (!answer) event.preventDefault()
          return
        }
      }
    }.bind(this))

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
      if (this.game.locked) return
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
    this.loadBallot = function() {
      var id = this.user._id
      if ($routeParams.uid && (this.user.admin || this.game.locked)) {
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


    // polls the game endpoint to prevent changes
    // after the game has been locked.
    this.pollGame = function() {
      $timeout(function() {
        GameService.find().then(function(game) {
          this.game.locked = this.user.admin ? false : game.locked
          this.pollGame()
        }.bind(this))
      }.bind(this), 5*60*1000)
    }



    // load the user, then the data!
    MeProvider.then(function(me) {
      this.user = me
      if (!this.user._id) return $location.path('/')

      GameService.find().then(function(game) {
        this.game = game
        this.game.locked = this.user.admin ? false : game.locked

        this.loadBallot()

        this.pollGame()
      }.bind(this))

    }.bind(this))


  })
