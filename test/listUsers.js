var b = require('../app/models/ballot')

b.find({}, 'id firstName lastName').exec(function(err, data) {
  console.log(err)
  console.log(data)
  process.exit()
})
