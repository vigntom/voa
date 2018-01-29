const userIndex = require('./users/index')
const userShow = require('./users/show')
const userNew = require('./users/new')
const userEdit = require('./users/edit')

module.exports = {
  index: userIndex,
  show: userShow,
  new: userNew,
  edit: userEdit
}
