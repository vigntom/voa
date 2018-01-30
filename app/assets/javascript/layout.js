const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { MessageDesk } = require('../../helpers/view-helper')

const { header, footer, div, a, nav, button, span, form, input } = hh(h)

function SignNavbar () {
  return div('.navbar-nav', [
    a('.nav-link', { href: '/login' }, 'Log In'),
    a('.nav-link', { href: '/signup' }, 'Sign up')
  ])
}

function AccountMenu (id) {
  return div('.navbar-nav', [
    a('.nav-link', { href: '/users' }, 'Users'),
    div('.dropdown', [
      a('#profileDropdown.nav-link.dropdown-toggle', {
        href: '#',
        'data-toggle': 'dropdown',
        'aria-haspopup': 'true',
        'aria-expanded': 'false'
      }, 'Account'),
      div('.dropdown-menu', { 'aria-labelledby': 'profileDropdown' }, [
        a('.dropdown-item', { href: `/users/${id}` }, 'Profile'),
        a('.dropdown-item', { href: `/users/${id}/edit` }, 'Settings'),
        div('.dropdown-divider'),
        a('.dropdown-item', {
          href: '/logout',
          'data-method': 'delete'
        }, 'Logout')
      ])
    ])
  ])
}

function Header (session) {
  const id = session.userId
  const isDefined = x => typeof x === 'string' && x.length > 0

  return header([
    nav('.navbar.navbar-expand-lg.navbar-dark.bg-dark', [
      div('.container', [
        a('.navbar-brand', { href: '/' }, 'VoA'),
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
        div('#navbarNavAltMarkup.collapse.navbar-collapse', [
          div('.navbar-nav.ml-auto', [
            form('.form-inline.pr-5', [
              input('.form-control.bg-dark-lighter.mr-sm-2', {
                type: 'search',
                placeholder: 'Search Polls',
                'aria-label': 'Search'
              }),
              button('.btn btn-outline-success my-2 my-sm-0', { type: 'submit' }, 'Search')
            ]),
            isDefined(id) ? AccountMenu(id) : SignNavbar()
          ])
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

module.exports = function Layout ({ page, notice, session }) {
  const messages = Object.assign({}, session.flash, notice)

  return div('#application', [
    Header(session),
    MessageDesk(messages),
    page,
    Footer()
  ])
}
