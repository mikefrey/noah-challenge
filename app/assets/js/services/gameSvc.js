"use strict";

angular.module('oscars')
  .factory('GameService', function($req, $q) {
    var baseUrl = '/api/games'

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


    function update(game) {
      var url = baseUrl + '/' + game._id
      return resolveOnMatch($req.put(url, game), game._id)
    }

    function find(id) {
      var url = baseUrl + (id ? '/' + id : '')
      return $req.get(url)
    }

    return {
      update: update,
      find: find
    }

  })
