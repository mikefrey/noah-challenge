'use strict'

angular.module('oscars')
  // .controller('LogoutCtrl', function ($window) {
  //   $window.location = '/logout?d'
  // })
  .controller('LogoutCtrl', function (authManager, $window) {
    authManager.unauthenticate()
    $window.location = '/logout?d'
  })
