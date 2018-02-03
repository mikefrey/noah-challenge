'use strict'

angular.module('oscars')
  .controller('ResultsCtrl', function (MeProvider, BallotService, CategoryService, GameService, $q, $location, $timeout) {
    this.updatedAt = ''
    this.isOscarParty = false

    // load the categories and ballot
    // merge the data so that the user's scores
    // are on each nominee
    this.load = function() {
      var p = {
        cats: CategoryService.list(),
        ballots: BallotService.find()
      }
      $q.all(p).then(function(res) {
        var cats = res.cats
        var ballots = res.ballots

        // find the remaining nominees
        var noms = cats.reduce(function(t, cat) {
          if (cat.winners && cat.winners.length > 0) return t
          return t.concat(_.pluck(cat.nominees, 'nomineeID'))
        }, [])

        // tally up points for each ballot
        ballots.forEach(function(ballot) {
          tallyBallot(ballot, cats, noms)
        })

        // find the average for each category
        cats.forEach(function(cat) {
          averageCategory(cat, ballots)
          var date = new Date(cat.updatedAt)
          this.updatedAt = date > this.updatedAt ? date : this.updatedAt
        }.bind(this))

        // rank each ballot against one another
        rankBallots(ballots)

        this.ballots = ballots
        this.categories = cats
      }.bind(this))
    }

    function tallyBallot(ballot, cats, noms) {
      ballot.points = cats.map(function(cat) {
        if (!cat.winners || !cat.winners.length)
          return 0

        var points = cat.winners.reduce(function(p, w) {
          var vote = _.findWhere(ballot.votes, {nomineeID:w})
          if (!vote) return p
          return p + vote.points
        }, 0)
        return points || 0
      })



      var possible = cats.reduce(function(t, cat) {
        if (cat.winners && cat.winners.length > 0) return t
        var noms = _.pluck(cat.nominees, 'nomineeID')

        var votes = _.filter(ballot.votes, function(vote) {
          return ~noms.indexOf(vote.nomineeID)
        })

        var max = _.reduce(votes, function(t, vote) { return Math.max(t, vote.points) }, 0)

        return t + Math.max(max, 0)
      }, 0)


      // var possible = ballot.votes.reduce(function(t, vote) {
      //   if (~noms.indexOf(vote.nomineeID)) {
      //     return t + vote.points
      //   }
      //   return t
      // }, 0)

      ballot.score = ballot.points.reduce(function(t, p) { return t + p }, 0)
      ballot.rankScore = ballot.points.reduce(function(t, p) { return t + Math.pow(p,2) }, 0)
      ballot.sortName = ballot.firstName+' '+ballot.lastName
      ballot.max = possible + ballot.score
    }

    function averageCategory(cat, ballots) {
      cat.avg = 0
      if (!ballots.length) return
      var total = ballots.reduce(function(total, ballot) {
        var pts = ballot.points[cat.position-1]
        return total + pts
      }, 0)
      cat.avg = total / ballots.length
    }

    function rankBallots(ballots) {
      ballots.sort(function(a, b) {
        var score = b.score - a.score
        var rankScore = b.rankScore - a.rankScore
        return score ? score : rankScore
      })

      var rank = 0
      var prevScore = Infinity
      var prevRankScore = Infinity
      ballots.forEach(function(ballot, i) {
        if (ballot.score < prevScore || ballot.rankScore < prevRankScore) {
          rank += 1
          prevRankScore = ballot.rankScore
          prevScore = ballot.score
        }
        ballot.rank = rank
        ballot.sortRank = i
      })
    }

    var sortBy = 'sortRank'
    var sortDir = 1
    this.sort = function(by) {
      // swap sort direction if sorting by the same field
      if (sortBy == by) sortDir *= -1
      else sortDir = 1
      sortBy = by

      if (typeof by == 'string') {
        this.ballots.forEach(function(ballot) {
          ballot.sortVal = ballot[by]
          if (by == 'sortName')
            ballot.sortVal = ballot.sortVal.toLowerCase()
        })
      }
      else if (typeof by == 'number') {
        this.ballots.forEach(function(ballot) {
          ballot.sortVal = ballot.points[by] * -1
        })
      }

      this.ballots.sort(function(a, b) {
        // doing string comparisons, so
        // subtraction won't work.
        return (a.sortVal < b.sortVal ? -1 :
               a.sortVal > b.sortVal ? 1 : 0) * sortDir
      })
    }

    // polls the game endpoint to prevent changes
    // after the game has been locked.
    this.pollGame = function() {
      GameService.find().then(function(game) {
        this.game.locked = this.user.admin ? true : game.locked
        $timeout(this.pollGame.bind(this), 5*60*1000)
      }.bind(this))
    }


    // load the user, then the data!
    MeProvider.then(function(me) {
      this.game = { locked: true }
      this.user = me
      if (!this.user) return $location.path('/')

      this.load()
      this.pollGame()
    }.bind(this))


  })
