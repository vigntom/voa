require('./setup-env')
require('../../index')
const test = require('ava')

function setup (model) {
  const clearModel = () => model.remove().exec()

  test.before(clearModel)
  test.afterEach(clearModel)
  test.after.always(clearModel)
}

module.exports = { setup }
