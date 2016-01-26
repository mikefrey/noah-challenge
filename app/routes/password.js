var Ballot = require('../models/ballot')
var Crypto = require('crypto')
var Sendgrid = require('sendgrid')(process.env.SENDGRID_API || 'abc')

module.exports = {

  forgot: function *(next) {

    var email = this.data.email.toLowerCase()

    var current = yield Ballot.findOne({ email: email }).exec()
    if (!current) return this.body = { success: true }

    var resetToken = Crypto.randomBytes(24).toString('base64')
    var resetBefore = Date.now() + (6 * 60 * 60 * 1000) // 6 hours

    Sendgrid.send({
      to: email,
      from: 'no-reply@goldenstatuechallenge.com',
      subject: 'Password Reset',
      text: 'Use the following link to reset your password:\nhttp://goldenstatuechallenge.com/reset-password?token=' + encodeURIComponent(resetToken)
    }, function(err, json) {
      if (err) return console.error(err)
      console.log(json)
    })

    var result = yield Ballot.findByIdAndUpdate(current._id,
      { $set: { resetToken: resetToken, resetBefore: resetBefore } },
      { new: true }
    ).exec()

    if (result) {
      this.body = { success: true }
    }
    this.body = { success: false }
  },

  reset: function *(next) {

    var result = yield Ballot.findOneAndUpdate({
      resetToken: this.data.resetToken,
      resetBefore: { $gte: Date.now() }
    }, {
      password: this.data.password,
      resetToken: null,
      resetBefore: null
    }).exec()

    this.body = { success: !!result }
  }


}
