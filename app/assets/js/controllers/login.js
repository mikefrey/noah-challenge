'use strict'

angular.module('oscars')
  // .controller('LoginCtrl', function ($scope, UserService, MeProvider, $location, $window) {
  .controller('LoginCtrl', function ($scope, authService) {

    // var getUsers = function() {
    //   UserService.list().then(function(users) {
    //     $scope.users = users
    //   }, function() {})
    // }
    //
    // $scope.login = function(user, password) {
    //   UserService.login(user._id, password)
    //     .then(function loginSuccess() {
    //       window.location = '/ballot'
    //     }, function loginError() {
    //       $location.url('/login-error')
    //     })
    // }
    //
    // $scope.gotoRegister = function() {
    //   $location.url('/register')
    // }
    //
    //
    //
    // // load the user, then the data!
    // MeProvider.then(function(me) {
    //   if (!me._id) return getUsers()
    //   $location.path('/ballot')
    // }.bind(this))


    $scope.login = function() {
      authService.login()
    }

  })
