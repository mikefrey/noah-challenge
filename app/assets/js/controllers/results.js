'use strict'

angular.module('oscars')
  .controller('ResultsCtrl', function (MeProvider, BallotService, CategoryService, $q) {

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

        // tally up points for each ballot
        ballots.forEach(function(ballot) {
          tallyBallot(ballot, cats)
        })

        // find the average for each category
        cats.forEach(function(cat) {
          averageCategory(cat, ballots)
        })

        // rank each ballot against one another
        rankBallots(ballots)

        this.ballots = ballots
        this.categories = cats
      }.bind(this))
    }

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
      ballot.rankScore = ballot.points.reduce(function(t, p) { return t + Math.pow(p,2) }, 0)
      ballot.sortName = ballot.lastName+' '+ballot.firstName
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
        return b.rankScore - a.rankScore
      })

      var rank = 0
      var prev = Infinity
      ballots.forEach(function(ballot, i) {
        if (ballot.rankScore < prev) {
          rank += 1
          prev = ballot.rankScore
        }
        ballot.rank = rank
        ballot.sortRank = i
      })
    }

    this.sort = function(by) {
      console.log('sorting by ', by)
      if (typeof by == 'string') {
        this.ballots.forEach(function(ballot) {
          ballot.sortVal = ballot[by]
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
        return a.sortVal < b.sortVal ? -1 :
               a.sortVal > b.sortVal ? 1 : 0
      })
    }


    // load the uesr, then the data!
    MeProvider.then(function() {
      this.user = MeProvider
      if (MeProvider.admin)
        this.load()
    }.bind(this))


  })
