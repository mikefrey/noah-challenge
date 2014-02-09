"use strict";

angular.module('oscars')
  .factory('CategoryService', function($req, $q) {
    var baseUrl = '/api/categories'

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


    function create(category) {
      var url = baseUrl
      return $req.post(url, category)
    }

    function update(category) {
      var url = baseUrl + '/' + category._id
      return $req.put(url, category)
    }

    function save(category) {
      if (category._id) {
        return update(category)
      }
      return create(category)
    }

    function destroy(id) {
      var url = baseUrl + '/' + id
      return resolveOnMatch($req.del(url), id)
    }

    function list() {
      var url = baseUrl
      return $req.get(url)
    }

    return {
      save: save,
      list: list,
      destroy: destroy
    }

  })
