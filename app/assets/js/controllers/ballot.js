'use strict'

angular.module('oscars')
  .controller('BallotCtrl', function (MeProvider, BallotService, CategoryService, $q, $timeout) {

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
        var ballot = { _id: this.user._id, votes: votes }
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

    // load the categories and ballot
    // merge the data so that the user's scores
    // are on each nominee
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
      }.bind(this),
      function() {
        console.log('something failed')
      })
    }

    // load the uesr, then the data!
    MeProvider.then(function() {
      this.user = MeProvider
      this.load()
    }.bind(this))


  })
