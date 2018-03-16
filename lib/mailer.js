const ejs = require('ejs')
const log = require('./logger')
const config = require('../config')

function render (template, data, cb) {
  return ejs.renderFile(template.html, data, (err, html) => {
    if (err) { return cb(err) }

    return ejs.renderFile(template.text, data, (err, text) => {
      if (err) { return cb(err) }

      const message = {
        from: config.email.from,
        subject: template.subject,
        html,
        text
      }

      return cb(null, message)
    })
  })
}

function send (message, transport, cb) {
  return transport.sendMail(message, (err, info) => {
    if (err) return cb(err)
    log.debug('mailer -> ', info.envelope)
    log.debug('mailer -> ', info.messageId)
    log.debug(info.message.toString())
    cb(null, info)
  })
}

function responseUrl (action, token, email) {
  const base = config.web.url
  const path = `${base}/${action}/${token}/edit`
  const query = `email=${encodeURIComponent(email)}`

  return `${path}?${query}`
}

function accountActivation (user, cb) {
  const { transport, view } = config.email
  const resetView = view('account-activation')

  const data = {
    username: user.username,
    url: responseUrl('accountActivations', user.activationToken, user.email)
  }

  const template = {
    html: resetView('html'),
    text: resetView('text'),
    subject: 'Account activation'
  }

  return render(template, data, (err, result) => {
    if (err) { return cb(err) }
    const message = Object.assign({}, result, { to: user.email })
    return send(message, transport, cb)
  })
}

function passwordReset (user, cb) {
  const { transport, view } = config.email
  const resetView = view('password-reset')

  const data = {
    username: user.username,
    url: responseUrl('passwordResets', user.resetToken, user.email)
  }

  const template = {
    html: resetView('html'),
    text: resetView('text'),
    subject: 'Password Reset'
  }

  return render(template, data, (err, result) => {
    if (err) { return cb(err) }
    const message = Object.assign({}, result, { to: user.email })
    return send(message, transport, cb)
  })
}

module.exports = {
  accountActivation,
  passwordReset
}
