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
      // return txt.replace(/(\S{4,})\b\s/g, '$1<br>')
      return txt.replace(/\s(\S{4,})\b/g, '<br>$1')
    }
  })
