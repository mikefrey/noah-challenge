'use strict'

angular.module('oscars')
  .controller('RegisterCtrl', function ($scope, UserService, $location) {

    $scope.createUser = function(user) {
      UserService.create(user)
        .then(function loginSuccess() {
          $location.url('/ballot')
        }, function loginError() {
          $location.url('/login-error')
        })
    }

  })
