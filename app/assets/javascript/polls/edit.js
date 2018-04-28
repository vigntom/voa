const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const Settings = require('./settings')

const { div, h1, h2, a, span, ul, li, input, label, button } = hh(h)

function Header ({ _id, name, author }) {
  return div('.py-3', [
    h1('.h3', [
      a({ href: `/users/${author._id}` }, author.username),
      span('.slash', ' / '),
      a({ href: `/polls/${_id}` }, name)
    ])
  ])
}

function PollTabNavBar ({ poll }) {
  return ul('.nav.nav-tabs.container.border-0', [
    li('.nav-item', [
      a('.nav-link.text-muted', { href: `/polls/${poll._id}` }, [
        span('.oi.oi-bar-chart.pr-1'),
        'Poll'
      ])
    ]),

    li('.nav-item', [
      a('.nav-link.active', { href: `/polls/${poll._id}/edit` }, [
        span('.oi.oi-cog.pr-1'),
        'Settings'
      ])
    ])
  ])
}

function Name ({ poll, errors }) {
  const options = w.maybeError({
    name: 'name',
    defaultValue: poll.name
  }, errors)

  return div('.form-row.mb-4', [
    div('.col-auto', [
      label({ htmlFor: 'name' }, 'Name'),
      input('#name.form-control', options)
    ]),

    div('.col-auto.align-self-end', [
      button('.btn.btn-outline-primary', 'Rename')
    ])
  ])
}

module.exports = function Page (options) {
  const { flash, poll } = options
  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        w.MessageDesk(flash),
        Header(poll),
        PollTabNavBar(options)
      ])
    ]),

    div('.row.justify-content-center.bg-white', [
      div('.col-7.p-5.voa-board', [
        Settings(options)
      ])
    ])
  ])
}
