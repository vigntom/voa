const userIndex = require('./users/index')
const userShow = require('./users/show')
const userNew = require('./users/new')

module.exports = {
  index: userIndex,
  show: userShow,
  new: userNew
}
