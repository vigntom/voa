const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { GroupLink } = require('../../../helpers/view-helper')

const { div } = hh(h)

module.exports = function EditGroup (options) {
  const { settings, choices, contributors, poll } = options
  const author = poll.author.username
  const pollname = poll.name
  const href = `/ui/${author}/${pollname}`

  return div('.list-group', [
    GroupLink({ cond: settings, href: href + '/settings' }, 'Settings'),
    GroupLink({ cond: choices, href: href + '/options' }, 'Options'),
    GroupLink({ cond: contributors, href: href + '/contributors' }, 'Contributors')
  ])
}
