"use strict";

angular.module('oscars')
  .provider('MeProvider', function () {
    var user

    this.$get = function(UserService) {

      if (!user) {
        user = UserService.me().then(function(me) {
          angular.extend(user, me)
        })
      }

      return user
    }
  })
