'use strict'

angular.module('oscars')
  // .controller('LogoutCtrl', function ($window) {
  //   $window.location = '/logout?d'
  // })
  .controller('LogoutCtrl', function (authManager) {
    localStorage.removeItem('id_token')
    authManager.unauthenticate()
  })
