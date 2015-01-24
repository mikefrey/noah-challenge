module.exports = function*(next) {
  var file = this.params.migration
  if (/^\d{8}_\w+$/.test(file)) {
    var migration = require('../migrations/'+migrations)
    try {
      yield migration()
    }
    catch (err) {
      return this.body = err
    }
    this.body = 'success'
  }
}
