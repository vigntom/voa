const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { header, footer, div, a, nav, button, span, form, input } = hh(h)

function CreateHeader () {
  return header([
    nav('.navbar.navbar-expand-lg.navbar-dark.bg-dark', [
      div('.container', [
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
            a('.nav-item.nav-link', { href: '#' }, 'Sign in'),
            a('.nav-item.nav-link', { href: '#' }, 'Sign up')
          ])
        ])
      ])
    ])
  ])
}

function CreateFooter (props) {
  return footer('.footer.container.py-3', [
    nav('.row.py-3.border-top', [
      div('.col-lg.text-muted.px-0', [
        'The ',
        a({ href: '#' }, 'Votting Application'),
        ' by ',
        a({ href: 'https://www.freecodecamp.org/vigntom2708' }, 'Aleksandr Ignatyev')
      ]),
      nav('.col-lg.text-right.px-0', [
        a('.pl-3', { href: '#' }, 'About'),
        a('.pl-3', { href: '#' }, 'Contact')
      ])
    ])
  ])
}

module.exports = function Layout ({ page }) {
  return div('#application', [CreateHeader(), page(), CreateFooter()])
}
