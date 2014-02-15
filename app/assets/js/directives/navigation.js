"use strict";

angular.module('oscars')
  .directive('navigation', function navigationDirective($rootScope) {
    console.log('$rootScope.me', $rootScope.me)
    return {
      restrict: 'E',
      scope: {
        me: '='
      },
      templateUrl: '/views/nav.html'
    }
  })
