const Ballot = require('../models/ballot')
const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))
const config = require('config')

const secret = config.get('auth0.clientSecret')
const audience = config.get('auth0.clientID')

module.exports = {

  index: function *(next) {
    let fields = 'id firstName lastName location party partyOnly'
    if (true || this.session.admin === true)
      fields += ' email admin'
    const users = yield Ballot.find({}, fields).exec()
    this.body = users
  },

  // login: function *(next) {
  //   var pw = this.data.pw
  //   var result = yield Ballot.findById(id, 'id').where('password', pw).exec()
  //
  //   if (result && id == result._id) {
  //     this.session.uid = id
  //     this.body = result
  //   } else {
  //     this.body = {}
  //   }
  // },

  // create: function *(next) {
  //
  //   if (!this.data.invite || this.data.invite.toLowerCase() !== 'kangaroo') {
  //     console.log('\n\nDID NOT PASS GO\n\n')
  //     this.body = { error: 'Incorrect invite code' }
  //     return this.status = 403
  //   }
  //
  //   this.data.email = this.data.email.toLowerCase()
  //
  //   const current = yield Ballot.findOne({ authId: this.data.authId }).exec()
  //   if (current) {
  //     this.body = { error: 'Account already exists' }
  //     return this.status = 401
  //   }
  //
  //   const result = yield Ballot.create(this.data)
  //   if (result) {
  //     this.session.uid = result._id
  //   }
  //   this.body = result
  // },

  update: function *(next) {
    const id = this.params.id
    delete this.data._id
    const result = yield Ballot.findByIdAndUpdate(id, this.data).exec()
    this.body = { _id:result._id }
  },

  destroy: function *(next) {
    const id = this.params.id
    const result = yield Ballot.findByIdAndRemove(id).exec()
    this.body = { _id:result._id }
  },

  me: function *(next) {
    if (!this.user) {
      this.body = {}
    } else {
      this.body = this.user
    }

    /// jshint is stupid
    yield process.nextTick
  }

}
