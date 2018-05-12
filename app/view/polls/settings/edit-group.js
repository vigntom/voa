const { div } = require('../../helpers/hyperscript')
const { GroupLink, path } = require('../../helpers')

module.exports = function EditGroup (options) {
  const { settings, contributors, poll } = options
  const author = poll.author.username
  const pollname = poll.name
  const href = x => path({ author, pollname, rest: x })

  return div('.list-group', [
    GroupLink({ cond: settings, href: href('settings') }, 'Settings'),
    GroupLink({ cond: options.options, href: href('options') }, 'Options'),
    GroupLink({ cond: contributors, href: href('/contributors') }, 'Contributors')
  ])
}
