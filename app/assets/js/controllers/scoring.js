'use strict'

angular.module('oscars')
  .controller('ScoringCtrl', function (CategoryService, MeProvider, $location) {

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

    this.saveWinners = function(category) {
      var winners = category.nominees.reduce(function (memo, nom) {
        if (nom.winner) memo.push(nom.nomineeID)
        return memo
      }, [])
      var cat = { _id: category._id, winners: winners }
      CategoryService.save(cat)
    }


    MeProvider.then(function(me) {
      if (me.admin)
        return this.getCategories()
      $location.path('/')
    }.bind(this))

  })
