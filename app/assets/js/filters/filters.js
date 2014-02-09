'use strict'

angular.module('oscars')
  .filter('fullName', function() {
    return function(obj) {
      return obj.firstName + ' ' + obj.lastName
    }
  })
