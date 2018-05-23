const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const EditGroup = require('./edit-group')
const NavBar = require('../nav-bar')
const Settings = require('./poll-settings')
const Options = require('./poll-options')
const { div, h1, a, span } = h

function Page (options) {
  const { poll, canUpdate } = options
  const author = poll.author.username
  const pollname = poll.name

  function activePage (options) {
    if (options.options) return Options(options)
    return Settings(options)
  }

  return div('.bg-light.main', [
    div('.main-header.border-bottom', [
      div('.container.p-0', [
        div('.py-3', [
          h1('.h3', [
            a({ href: w.path({ author }) }, author),
            span('.slash', ' / '),
            a({ href: w.path({ author, pollname }) }, pollname)
          ])
        ]),

        NavBar({ poll, canUpdate, active: 'Settings' })
      ])
    ]),

    div('.main-body.bg-white', [
      w.MessageDesk(options.flash),
      div('.container.py-5', [
        div('.row.justify-content-center.bg-white', [
          div('.col-3', [ EditGroup(options) ]),
          div('.col-7', [ activePage(options) ])
        ])
      ])
    ])
  ])
}

module.exports = Page
