"use strict";

angular.module('oscars')
  .factory('BallotService', function($req, $q) {
    var baseUrl = '/api/ballots'

    function resolveOnMatch(promise, id) {
      var dfd = $q.defer()
      promise.then(function(data) {
        if (data._id == id)
          dfd.resolve()
        else
          dfd.reject()
      }, dfd.reject)
      return dfd.promise
    }


    function update(user) {
      var url = baseUrl + '/' + user._id
      return resolveOnMatch($req.put(url, user), user._id)
    }

    function find(id) {
      var url = baseUrl + '/' + id
      return $req.get(url)
    }

    return {
      update: update,
      find: find
    }

  })
