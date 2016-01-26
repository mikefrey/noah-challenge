"use strict";

angular.module('oscars')
  .factory('PasswordService', function($req, $q) {
    var baseUrl = '/api/password'

    function forgot(email) {
      var url = baseUrl
      return $req.post(url, { email: email })
    }

    function reset(password, resetToken) {
      var url = baseUrl
      return $req.put(url, {
        password: password,
        resetToken: resetToken
      })
    }

    return {
      forgot: forgot,
      reset: reset
    }

  })
