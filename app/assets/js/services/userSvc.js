"use strict";

angular.module('oscars')
  .factory('UserService', function($req, $q) {
    var baseUrl = '/api/users'

    function create(user) {
      var url = baseUrl
      return $req.post(url, user)
    }

    function destroy(id) {
      var url = baseUrl + '/' + id
      return $req.del(url)
    }

    function list() {
      var url = baseUrl
      return $req.get(url)
    }

    function login(id, password) {
      var dfd = $q.defer()
      var url = baseUrl
      $req.put(url, {id:id, pw:password})
        .then(function(data) {
          if (data._id == id)
            dfd.resolve()
          else
            dfd.reject()
        }, dfd.reject)
      return dfd.promise
    }

    return {
      create: create,
      list: list,
      login: login,
      destroy: destroy
    }

  })
