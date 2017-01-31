const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))
const config = require('config')

const secret = config.get('auth0.clientSecret')
const audience = config.get('auth0.clientID')

module.exports = function *(next) {
  const token = this.request.headers.authorization

  if (!token) return this.redirect('/')

  token = token.replace('Bearer ', '')
  try {
    this.state.user = yield jwt.verifyAsync(token, secret, { audience })
  } catch (ex) {
    return this.redirect('/')
  }

  yield next
}
