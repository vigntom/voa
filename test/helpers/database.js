require('../../index')
const test = require('ava')

function setup (model) {
  const clearModel = () => model.remove().exec()

  test.after.always(clearModel)
}

module.exports = { setup }
