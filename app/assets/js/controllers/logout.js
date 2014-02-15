'use strict'

angular.module('oscars')
  .controller('LogoutCtrl', function ($window) {
    $window.location = '/logout?d'
  })
