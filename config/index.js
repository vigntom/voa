const path = require('path')
const nodemailer = require('nodemailer')
const environment = require('./environment')

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 5000
const web = createExtractor('web')
const mailDir = path.join(__dirname, '..', 'emails', 'mailer')

const config = {
  env,
  port: port,

  app: {
    name: 'VoA'
  },

  logger: environment[env].log,

  web: {
    host: web('host'),
    port: web('port'),
    url: `${web('protocol')}://${web('host')}:${web('port')}`,
    concurrency: web('concurrency')
  },

  secret: {
    key: process.env.SECRET_KEY
  },

  db: {
    uri: process.env.MONGODB_URI || cretateMongoUri(env)
  },

  email: {
    transport: emailService(env),
    from: createExtractor('email')('from'),
    view: name => format => path.join(mailDir, `${name}.${format}.ejs`)
  }
}

function envTag (env) {
  const testVar = env.toUpperCase()
  if (testVar === '') { return '' }
  if (testVar === 'PRODUCTION') { return '' }
  return `_${testVar}`
}

function createExtractor (div, env = '') {
  const tag = envTag(env)
  return x => process.env[`${div.toUpperCase()}_${x.toUpperCase()}` + tag]
}

function cretateMongoUri (env) {
  const param = createExtractor('mongo', env)

  const name = param('name')
  const user = param('user')
  const pass = param('pass')
  const host = param('host')
  const port = param('port')

  return `mongodb://${user}:${pass}@${host}:${port}/${name}`
}

function emailService (env) {
  const service = process.env['SMTP_SERVICE' + envTag(env)]
  const param = x => process.env[`SMTP_${service}_${x.toUpperCase()}`]

  if (env !== 'test') {
    return nodemailer.createTransport({
      host: param('host'),
      port: param('port'),
      auth: {
        user: param('user'),
        pass: param('pass')
      }
    })
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: 'true'
  })
}

module.exports = config
