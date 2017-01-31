"use strict";

angular.module('oscars')
  .factory('$req', function($http, $q) {

    function req(method, url, data) {
      var dfd = $q.defer()
      $http[method](url, data).then(function(resp) {
        return dfd.resolve(resp.data)
      }).catch(dfd.reject)
      return dfd.promise
    }

    function get(url) {
      return req('get', url)
    }

    function post(url, data) {
      return req('post', url, data)
    }

    function put(url, data) {
      return req('put', url, data)
    }

    function del(url) {
      return req('delete', url)
    }

    return {
      get: get,
      post: post,
      put: put,
      del: del
    }

  })
