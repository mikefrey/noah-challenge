"use strict";

angular.module('oscars')
  .directive('navigation', function navigationDirective() {
    return {
      restrict: 'E',
      scope: {
        me: '='
      },
      templateUrl: '/views/nav.html'
    }
  })
