var b = require('../app/models/ballot')

 var x = b.create({
  firstName:'Noah',
  lastName:'Wenz',
  email:'noahwenz@me.com',
  admin:true,
  password:'password',
  votes:[]
}, function(err, data) {
  console.log(err)
  console.log(data)
  process.exit()
})
