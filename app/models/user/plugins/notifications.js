function plugin (schema, options) {
  schema.virtual('mailbox.inbox', {
    ref: 'Mailbox',
    localField: '_id',
    foreignField: 'to'
  })

  schema.virtual('mailbox.outbox', {
    ref: 'Mailbox',
    localField: '_id',
    foreignField: 'from'
  })
}

module.exports = plugin
