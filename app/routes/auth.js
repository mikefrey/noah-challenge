const Ballot = require('../models/ballot')
const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))
const config = require('config')
const Wreck = require('wreck')

const secret = config.get('auth0.clientSecret')
const audience = config.get('auth0.clientID')

const INVITE_CODE = 'interlinked'

function getUserInfo(token) {
  const url = 'https://goldenstatuechallenge.auth0.com/tokeninfo'
  const opts = { payload: { id_token: token }, json: true }
  return new Promise(function(resolve, reject) {
    Wreck.post(url, opts, (err, res, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })
}

module.exports = {

  login: function *(next) {
    const token = this.data.jwt
    const user = yield jwt.verifyAsync(token, secret, { audience })

    const result = yield Ballot.findOne({ authId: user.sub }).exec()

    if (result) {
      this.session.uid = result._id
      return this.body = result
    }

    const auth0User = yield getUserInfo(token)
    this.body = { email: auth0User.email, authId: user.sub }
  },

  signup: function *(next) {

    if (!this.data.invite || this.data.invite.toLowerCase() !== INVITE_CODE) {
      console.log('\n\nDID NOT PASS GO\n\n')
      this.body = { error: 'Incorrect invite code' }
      return this.status = 403
    }

    if (!this.data.authId) {
      console.log('NO AUTHID')
      this.body = { error: 'No authId found' }
      return this.status = 403
    }

    this.data.email = this.data.email.toLowerCase()

    const current = yield Ballot.findOne({
      $or: [
        { authId: this.data.authId },
        { email: this.data.email }
      ]}).exec()
    if (current) {
      this.body = { error: 'Account already exists' }
      return this.status = 401
    }

    const result = yield Ballot.create(this.data)
    console.log('RESULT', result)
    if (result) {
      console.log('CREATE ID', result._id)
      this.session.uid = result._id
    }
    this.body = result
  },

  logout: function *(next) {
    this.session = null
    this.redirect('/')

    /// jshint is stupid
    yield process.nextTick
  }

}
