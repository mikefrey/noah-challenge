'use strict';

angular.module('oscars', [
    'ngRoute',
    'ngSanitize',
    'auth0.lock',
    'angular-jwt'
])
.config(function (lockProvider) {
  lockProvider.init({
    clientID: 'ehiPo219n7XhyCkXKiAo5iVTtXHKKUf8',
    domain: 'goldenstatuechallenge.auth0.com'
  })
})
.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true)

  $routeProvider

    .when('/', {
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })

    .when('/logout', {
      template: '<div></div>',
      controller: 'LogoutCtrl'
    })

    .when('/register', {
      templateUrl: '/views/register.html',
      controller: 'RegisterCtrl as ctrl'
    })

    .when('/login-error', {
      templateUrl: '/views/loginError.html',
      controller: 'LoginErrorCtrl as ctrl'
    })

    .when('/ballot/:uid?', {
      templateUrl: '/views/ballot.html',
      controller: 'BallotCtrl as ctrl'
    })

    .when('/results', {
      templateUrl: '/views/results.html',
      controller: 'ResultsCtrl as ctrl'
    })

    .when('/forgot-password', {
      templateUrl: '/views/forgotPassword.html',
      controller: 'ForgotCtrl'
    })

    .when('/reset-password', {
      templateUrl: '/views/resetPassword.html',
      controller: 'ResetCtrl'
    })

    .when('/howtoplay', {
      templateUrl: '/views/howToPlay.html'
    })

    .when('/admin/users', {
      templateUrl: '/views/userList.html',
      controller: 'UserCtrl as ctrl'
    })

    .when('/admin/categories', {
      templateUrl: '/views/categories.html',
      controller: 'CategoryCtrl as ctrl'
    })

    .when('/admin/scoring', {
      templateUrl: '/views/scoring.html',
      controller: 'ScoringCtrl as ctrl'
    })

    .otherwise({
      templateUrl: '/views/404.html'
    }
  )

})
// .run(function(MeProvider){})
.run(function (authService, lock) {
  authService.registerAuthenticationListener()
})
