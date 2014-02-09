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

    .when('/admin/users', {
      templateUrl: '/views/userList.html',
      controller: 'UserCtrl'
    })

    .otherwise({
      redirectTo: '/'
    }
  )

})
