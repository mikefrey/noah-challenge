'use strict'

angular.module('oscars')
  .controller('CategoryCtrl', function (CategoryService, MeProvider, $location) {

    this.getCategories = function() {
      CategoryService.list().then(function(categories) {
        this.categories = categories || []
      }.bind(this), function() {})
    }

    this.deleteCategory = function(category, idx) {
      if (!category._id) return this.categories.splice(idx, 1)
      CategoryService.destroy(category._id).then(function() {
        this.categories.splice(idx, 1)
      }.bind(this))
    }

    this.deleteNominee = function(category, idx) {
      category.nominees.splice(idx, 1)
    }

    this.saveCategory = function(category) {
      CategoryService.save(category).then(function(cat) {
        category._id = cat._id
      })
    }

    this.addNewCategory = function() {
      this.categories.push({
        position: this.categories.length + 1,
        nominees: [ { position: 1 } ]
      })
    }

    this.addNewNominee = function(category) {
      category.nominees.push({
        position: category.nominees.length + 1
      })
    }

    this.sort = 'position'

    MeProvider.then(function(me) {
      if (me.admin)
        return this.getCategories()

      $location.path('/')
    }.bind(this))

  })
