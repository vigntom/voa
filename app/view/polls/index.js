const rootPage = require('./root')
const newPoll = require('./new')
const show = require('./show')
const settings = require('./settings')

module.exports = {
  index: rootPage,
  new: newPoll,
  show,
  settings
}
