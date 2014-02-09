'use strict';

angular.module('oscars', [
    'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true)

  $routeProvider

    .when('/', {
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })

    .when('/register', {
      templateUrl: '/views/register.html',
      controller: 'RegisterCtrl'
    })

    .when('/login-error', {
      templateUrl: '/views/loginError.html',
      controller: 'LoginErrorCtrl'
    })

    .when('/ballot', {
      templateUrl: '/views/ballot.html',
      controller: 'BallotCtrl'
    })

    .when('/howtoplay', {
      templateUrl: '/views/howToPlay.html'
    })

    .when('/admin/users', {
      templateUrl: '/views/userList.html',
      controller: 'UserCtrl'
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
