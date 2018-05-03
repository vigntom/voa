const rootPage = require('./root')
const newPoll = require('./new')
const show = require('./show')
const settings = require('./settings')
const choices = require('./choices')

module.exports = {
  index: rootPage,
  new: newPoll,
  show,
  settings,
  choices
}
