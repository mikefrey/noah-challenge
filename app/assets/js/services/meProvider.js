"use strict";

angular.module('oscars')
  .provider('MeProvider', function () {
    var user

    this.$get = function(UserService, $rootScope) {

      if (!user) {
        user = UserService.me().then(function(me) {
          $rootScope.me = !!me._id ? me : null
          return me
        })
      }

      return user
    }
  })
