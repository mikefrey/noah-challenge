module.exports = function *(next) {
  this.session = null
  this.redirect('/')

  /// jshint is stupid
  yield process.nextTick
}
