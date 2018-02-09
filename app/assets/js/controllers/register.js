'use strict'

angular.module('oscars')
  .controller('RegisterCtrl', function (UserService, $location, $scope) {

    var currentUser = UserService.currentUser()
    if (!currentUser || !currentUser.authId) {
      return $location.url('/')
    }

    $scope.newUser = angular.copy(currentUser)
    console.log('NEW USER', $scope.newUser)

    this.createUser = function(user) {

      if (!(user && user.firstName && user.lastName &&
            user.email && user.location && user.invite)) {
        return this.error = 'Please fill in all fields!'
      }

      if (!/^[^@]+@[^@]+$/.test(user.email)) {
        return this.error = 'Email address is not in the proper format.'
      }

      UserService.create(user)
        .then(function loginSuccess() {
          $location.url('/ballot')
        })
        .catch(function loginError(resp) {
          if (resp.data && resp.data.error) this.error = resp.data.error
        }.bind(this))
    }

  })
