'use strict'

angular.module('oscars')
  .controller('RegisterCtrl', function (UserService, $location) {

    this.createUser = function(user) {
      UserService.create(user)
        .then(function loginSuccess() {
          $location.url('/ballot')
        }, function loginError() {
          $location.url('/login-error')
        })
    }

  })
