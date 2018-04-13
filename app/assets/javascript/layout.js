const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { header, footer, div, a, nav, button, span, form, input } = hh(h)

function SignNavbar () {
  return div('.navbar-nav', [
    a('.nav-link', { href: '/login' }, 'Log In'),
    a('.nav-link', { href: '/signup' }, 'Sign up')
  ])
}

function AccountMenu (id) {
  return div('.navbar-nav', [
    a('.nav-link', { href: '/polls/new' }, 'Create Poll'),
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

function Header (user) {
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
              input('.hidden', { type: 'submit' })
            ]),
            user ? AccountMenu(user._id) : SignNavbar()
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

module.exports = function Layout ({ options, page }) {
  return div('#application', [
    Header(options.session.user),
    page,
    Footer()
  ])
}
