'use strict'

angular.module('oscars')
  .controller('ScoringCtrl', function (CategoryService, GameService, MeProvider, $location) {

    this.getCategories = function() {
      CategoryService.list().then(function(categories) {
        categories.forEach(function(cat) {
          cat.nominees.forEach(function(nom) {
            nom.winner = !!~cat.winners.indexOf(nom.nomineeID)
          })
        })
        this.categories = categories
      }.bind(this), function() {})
    }

    this.getGame = function() {
      GameService.find().then(function(game) {
        this.game = game
      }.bind(this))
    }

    this.saveWinners = function(category) {
      var winners = category.nominees.reduce(function (memo, nom) {
        if (nom.winner) memo.push(nom.nomineeID)
        return memo
      }, [])
      var cat = { _id: category._id, winners: winners }
      CategoryService.save(cat)
    }

    this.lockToggleEnabled = true
    this.toggleLock = function() {
      this.lockToggleEnabled = false
      this.game.locked = !this.game.locked
      GameService.update(this.game).then(
        function() {
          this.lockToggleEnabled = true
        }.bind(this),
        function() {
          // failed, flip it back
          this.lockToggleEnabled = true
          this.game.locked = !this.game.locked
        }.bind(this))
    }


    MeProvider.then(function(me) {
      if (!me.admin) $location.path('/')

      this.getCategories()
      this.getGame()
    }.bind(this))

  })
