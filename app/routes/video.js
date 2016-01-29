var fs = require('fs')
var Path = require('path')

module.exports = function *(next) {
  var path = Path.join(__dirname, '/../assets/img/oscars-2016.mp4')
  var stat = fs.statSync(path)
  var total = stat.size

  if (this.header.range) {
    var range = this.header.range
    var parts = range.replace(/bytes=/, '').split('-')
    var partialstart = parts[0]
    var partialend = parts[1]

    var start = parseInt(partialstart, 10)
    var end = partialend ? parseInt(partialend, 10) : total - 1
    var chunksize = (end - start) + 1
    //console.log('RANGE:', start, '-', end, '=', chunksize)

    var stream = fs.createReadStream(path, {start:start, end:end})
    this.set({
      'Content-Type': 'video/mp4',
      'Content-Length': chunksize,
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes'
    })
    this.status = 206
    this.body = stream
  }
  else {
    console.log('ALL:', total)
    this.set({
      'Content-Length': total,
      'Content-Type': 'video/mp4'
    })
    this.body = fs.createReadStream(path)
  }
}
