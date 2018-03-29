const pageRoot = require('./root')
const pageNew = require('./new')
const pageShow = require('./show')
const pageEdit = require('./edit')

module.exports = {
  index: pageRoot,
  new: pageNew,
  show: pageShow,
  edit: pageEdit
}
