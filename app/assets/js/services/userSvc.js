"use strict";

angular.module('oscars')
  .factory('UserService', function($req, $q) {
    var baseUrl = '/api/users'

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

    function me() {
      var url = baseUrl + '/me'
      return $req.get(url)
    }

    function create(user) {
      var url = baseUrl
      return $req.post(url, user)
    }

    function update(user) {
      var url = baseUrl + '/' + user._id
      return resolveOnMatch($req.put(url, user), user._id)
    }

    function destroy(id) {
      var url = baseUrl + '/' + id
      return resolveOnMatch($req.del(url), id)
    }

    function list() {
      var url = baseUrl
      return $req.get(url)
    }

    function login(id, password) {
      var url = baseUrl
      return resolveOnMatch($req.put(url, {id:id, pw:password}), id)
    }

    return {
      me: me,
      create: create,
      update: update,
      list: list,
      login: login,
      destroy: destroy
    }

  })
