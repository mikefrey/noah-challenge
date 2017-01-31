angular.module('oscars')
  .service('authService', function(lock, authManager, $req, $q, $location, UserService) {

    function login() {
      lock.show()
    }

    function registerAuthenticationListener() {
      lock.on('authenticated', function(authResult) {
        tryLogin(authResult.idToken, authResult.idTokenPayload.sub)
        authManager.authenticate()
      })
    }

    function tryLogin(idToken, authId) {
      $req.put('/api/users', { jwt: idToken })
        .then(function(data) {
          UserService.currentUser(data)
          if (data._id) {
            return $location.path('/ballot')
          } else {
            return $location.path('/register')
          }
        })
    }

    return {
      login: login,
      registerAuthenticationListener: registerAuthenticationListener
    }
  })
