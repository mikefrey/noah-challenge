module.exports = {

  mongo: {
    url: process.env.MONGOHQ_URL || "mongodb://localhost/oscars"
  },

  keys: [']pb[`k(+gf@?.[L9[D7GPA', 'yIvWTOG=nR3iVr|_m.{7wj'],

  session: {
    key: 'sess',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    signed: true
  },

  passport: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  }

}
