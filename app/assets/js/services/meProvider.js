"use strict";

angular.module('oscars')
  .provider('MeProvider', function () {
    var user

    this.$get = function(UserService, $rootScope) {

      if (!user) {
        user = UserService.me().then(function(me) {
          angular.extend(user, me)
        })
        $rootScope.me = user
      }

      return user
    }
  })
