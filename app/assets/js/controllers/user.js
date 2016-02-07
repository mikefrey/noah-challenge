'use strict'

angular.module('oscars')
  .controller('UserCtrl', function (UserService, $location, MeProvider) {

    this.getUsers = function() {
      UserService.list().then(function(users) {
        this.users = users
      }.bind(this))
    }

    this.deleteUser = function(id, idx) {
      UserService.destroy(id).then(function() {
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i]._id == id) {
            this.users.splice(i, 1)
            break
          }
        }
      }.bind(this))
    }

    this.saveUser = function(user) {
      UserService.update(user).then(function() {
        console.log('User updated!')
      })
    }

    this.sort = 'firstName'
    this.dir = false

    MeProvider.then(function(me) {
      if (me.admin)
        return this.getUsers()
      $location.path('/')
    }.bind(this))
  })
