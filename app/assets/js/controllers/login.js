'use strict'

angular.module('oscars')
  .controller('LoginCtrl', function ($scope, UserService, $location, $window) {

    var getUsers = function() {
      UserService.list().then(function(users) {
        $scope.users = users
      }, function() {})
    }

    $scope.login = function(user, password) {
      UserService.login(user._id, password)
        .then(function loginSuccess() {
          window.location = '/ballot'
          // $location.url('/ballot')
        }, function loginError() {
          $location.url('/login-error')
        })
    }

    $scope.gotoRegister = function() {
      $location.url('/register')
    }

    getUsers()

  })
