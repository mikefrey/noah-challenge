'use strict'

angular.module('oscars')
  .controller('ForgotCtrl', function ($scope, PasswordService, $location) {

    $scope.forgot = function(email) {
      PasswordService.forgot(email)
        .then(function loginSuccess() {
          $scope.success = 'An email has been sent with a link to reset your password.'
        }, function loginError() {
          $scope.error = 'Something went wrong, please try again.'
        })
    }

  })
