'use strict'

angular.module('oscars')
  .controller('RegisterCtrl', function (UserService, $location) {

    this.createUser = function(user) {

      if (!(user && user.firstName && user.lastName &&
            user.password && user.email && user.invite)) {
        return this.error = 'Please fill in all fields!'
      }

      if (!/^[^@]+@[^@]+$/.test(user.email)) {
        return this.error = 'Email address is not in the proper format.'
      }

      UserService.create(user)
        .then(function loginSuccess() {
          $location.url('/ballot')
        }, function loginError(data) {
          console.log(arguments)
          if (data.error)
            this.error = data.error
          // $location.url('/login-error')
        }.bind(this))
    }

  })
