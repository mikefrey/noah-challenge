noah-challenge
==============

## Setup

### Prerequistes

**Node.js 0.11.11 or greater:** Mac OSX installer can be found here: http://nodejs.org/dist/v0.11.11/node-v0.11.11.pkg

**Grunt**: you might have to run this with `sudo`
```
npm install -g grunt-cli
```

Application dependencies:
```bash
npm install
```

### Local Development

Run grunt to build the app:
```
grunt
```

Then run the app:
```
npm start
```

### Test the heroku build
```
grunt heroku
```
