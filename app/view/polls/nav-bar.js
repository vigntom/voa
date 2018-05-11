const classnames = require('classnames')
const { ul, li, a, span } = require('../helpers/hyperscript')
const w = require('../helpers')

function Poll ({ poll, active }) {
  const author = poll.author.username
  const pollname = poll.name

  return a({
    href: w.path({ author, pollname }),
    className: classnames('nav-link', { active }, { 'text-muted': !active })
  }, [
    span('.oi.oi-bar-chart.pr-1'),
    'Poll'
  ])
}

function Settings ({ canUpdate, poll, active }) {
  const author = poll.author.username
  const pollname = poll.name

  if (!canUpdate && !active) return null

  return a({
    href: w.path({ author, pollname, rest: 'settings' }),
    className: classnames('nav-link', { active }, { 'text-muted': !active })
  }, [
    span('.oi.oi-cog.pr-1'),
    'Settings'
  ])
}

function NavBar ({ poll, active, canUpdate }) {
  return ul('.nav.nav-tabs.container.border-0', [
    li('.nav-item', Poll({ poll, active: active !== 'Settings' })),
    li('.nav-item', Settings({ poll, canUpdate, active: active === 'Settings' }))
  ])
}

module.exports = NavBar
