const nodemailer = require('nodemailer')

nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ', err.message)
    return process.exit(1)
  }

  console.log('Credentials obtained, sending message...')

  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  })

  const message = {
    from: 'Sender Name <sender.name@example.com>',
    to: 'Recipient <recipient@example.com>',
    subject: 'Nodemailer test subject',
    text: 'Hello',
    html: '<p><b>Hello</b> to somebody!</p>'
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.error('Error occured. ', err.message)
      return process.exit(1)
    }

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
})
