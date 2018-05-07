const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../helpers/view-helper')

const { header, footer, div, a, nav, button, span, form, input } = hh(h)

function SignNavbar () {
  return div('.navbar-nav', [
    a('.nav-link', { href: '/login' }, 'Log In'),
    a('.nav-link', { href: '/signup' }, 'Sign up')
  ])
}

function AccountMenu ({ username }) {
  return div('.navbar-nav', [
    a('.nav-link', { href: `/ui/${username}/new` }, 'Create Poll'),
    div('.dropdown', [
      a('#profileDropdown.nav-link.dropdown-toggle', {
        href: '#',
        'data-toggle': 'dropdown',
        'aria-haspopup': 'true',
        'aria-expanded': 'false'
      }, 'Account'),
      div('.dropdown-menu', { 'aria-labelledby': 'profileDropdown' }, [
        a('.dropdown-item', { href: `/ui/${username}` }, 'Profile'),
        a('.dropdown-item', { href: `/settings` }, 'Settings'),
        div('.dropdown-divider'),
        a('.dropdown-item', {
          href: '/logout',
          'data-method': 'delete'
        }, 'Logout')
      ])
    ])
  ])
}

function Header (options) {
  const user = options.session.user
  const query = options.query || {}

  return header([
    nav('.navbar.navbar-expand-lg.navbar-dark.bg-dark.voa-navbar.voa-lighter', [
      div('.container', [
        a('.navbar-brand', { href: '/' }, 'VoA'),
        button('.navbar-toggler', {
          type: 'button',
          'data-toggle': 'collapse',
          'data-target': '#navbar-voa',
          'aria-controls': 'navbar-voa',
          'aria-expanded': false,
          'aria-label': 'Toggle navigator'
        }, span('.navbar-toggler-icon')),

        div('#navbar-voa.collapse.navbar-collapse', [
          form('.form-inline.ml-lg-3.mr-auto.my-1.my-lg-0', {
            action: '/search',
            method: 'get'
          }, [
            input({ type: 'hidden', name: 'type', value: query.type || 'poll' }),
            input('.form-control.border-0.navbar-search', {
              type: 'search',
              placeholder: 'Search ...',
              'aria-label': 'Search',
              name: 'q',
              defaultValue: query.q
            }),
            input('.hidden', { type: 'submit' })
          ]),

          user ? AccountMenu(user) : SignNavbar()
        ])
      ])
    ])
  ])
}

function Footer (props) {
  return footer('.footer.bg-light.container-fluid', [
    nav('.row.mx-0.py-3.border-top', [
      div('.col-lg.text-muted.px-0', [
        'The ',
        a({ href: '/' }, 'Votting Application'),
        ' by ',
        a({ href: 'https://www.freecodecamp.org/vigntom2708' }, 'Aleksandr Ignatyev')
      ]),
      nav('.col-lg.text-right.px-0', [
        a('.pl-3', { href: '/about' }, 'About'),
        a('.pl-3', { href: '/contact' }, 'Contact')
      ])
    ])
  ])
}

module.exports = function Layout ({ options, page }) {
  return div('#application', [
    Header(options),
    page,
    Footer()
  ])
}
