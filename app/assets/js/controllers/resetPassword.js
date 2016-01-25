'use strict'

angular.module('oscars')
  .controller('ResetCtrl', function ($scope, PasswordService, $routeParams, $location) {

    var resetToken = $routeParams.token

    if (!resetToken)
      $scope.success = 'How did you get here? You shouldn\'t be here!'

    $scope.reset = function(password, confirm) {

      if (!password || !confirm)
        return $scope.error = 'Password and Confirm Password are required.'

      if (password !== confirm)
        return $scope.error = 'Passwords do not match'

      PasswordService.reset(email)
        .then(function success() {
          $scope.success = 'Your password has been changed.'
        }, function error() {
          $scope.error = 'Something went wrong, please try again.'
        })
    }

  })
