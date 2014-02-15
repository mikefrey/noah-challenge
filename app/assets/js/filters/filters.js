'use strict'

angular.module('oscars')
  .filter('fullName', function() {
    return function(obj) {
      if (!obj) return ''
      return obj.firstName + ' ' + obj.lastName
    }
  })
  .filter('break', function() {
    return function(txt) {
      return txt.replace(/\s/g, '<br>')
    }
  })
