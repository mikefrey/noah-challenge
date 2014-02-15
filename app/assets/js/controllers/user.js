'use strict'

angular.module('oscars')
  .controller('UserCtrl', function (UserService, $location) {

    this.getUsers = function() {
      UserService.list().then(function(users) {
        this.users = users
      }.bind(this))
    }

    this.deleteUser = function(id, idx) {
      UserService.destroy(id).then(function() {
        this.users.splice(idx, 1)
      }.bind(this))
    }

    this.toggleAdmin = function(user) {
      UserService.update(user).then(function() {
        console.log('User updated!')
      })
    }

    this.sort = 'firstName'
    this.dir = false

    this.getUsers()

  })
