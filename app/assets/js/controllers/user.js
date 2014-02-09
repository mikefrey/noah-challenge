'use strict'

angular.module('oscars')
  .controller('UserCtrl', function ($scope, UserService, $location) {

    var getUsers = function() {
      UserService.list().then(function(users) {
        $scope.users = users
      }, function() {})
    }

    $scope.deleteUser = function(id, idx) {
      UserService.destroy(id).then(function() {
        $scope.users.splice(idx, 1)
      })
    }

    $scope.toggleAdmin = function(user) {
      UserService.update(user).then(function() {
        console.log('User updated!')
      })
    }

    $scope.refresh = getUsers
    $scope.sort = 'firstName'
    $scope.dir = false

    getUsers()

  })
