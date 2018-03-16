const pageRoot = require('./root')
const pageShow = require('./show')
const pageNew = require('./new')
const pageEdit = require('./edit')

module.exports = {
  index: pageRoot,
  show: pageShow,
  new: pageNew,
  edit: pageEdit
}
