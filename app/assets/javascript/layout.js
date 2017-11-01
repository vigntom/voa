const h = require('hyperscript')
const hh = require('hyperscript-helpers')

const { header, div, a, nav, button, span } = hh(h)

module.exports = header(
  nav('.navbar.navbar-expand-lg.navbar-dark.bg-dark', [
    a('.navbar-brand', { href: '#' }, 'VoA'),
    button('.navbar-toggler', {
      type: 'button',
      'data-toggle': 'collapse',
      'data-target': '#navbarNavAltMarkup',
      'aria-controls': 'navbarNavAltMarkup',
      'aria-expanded': false,
      'aria-label': 'Toggle navigator'
    },
      span('.navbar-toggler-icon')
    ),
    div('#navbarNavAltMarkup.collapse.navbar-collapse',
      div('.navbar-nav.ml-auto', [
        a('.nav-item.nav-link.active', { href: '#' }, 'Home', span('.sr-only', '(current)')),
        a('.nav-item.nav-link', { href: '#' }, 'Help'),
        a('.nav-item.nav-link', { href: '#' }, 'Log in')
      ])
    )
  ])
)
