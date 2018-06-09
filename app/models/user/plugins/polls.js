function plugin (schema, options) {
  schema.add({ polls: { type: Number, default: 0 } })
  schema.virtual('pollList', {
    ref: 'Poll',
    localField: '_id',
    foreignField: 'author'
  })
}

module.exports = plugin
