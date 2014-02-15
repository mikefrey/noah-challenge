"use strict";

angular.module('oscars')
  .provider('navigation', function navigationDirective($rootScope) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/views/nav.html',
      controller: function($scope) {
        $scope.me = $rootScope.me
      }
    }
  })