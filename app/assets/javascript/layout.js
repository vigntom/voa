const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { header, footer, div, a, nav, button, span, form, input } = hh(h)

function CreateHeader () {
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
            a('.nav-item.nav-link', { href: '/signin' }, 'Sign in'),
            a('.nav-item.nav-link', { href: '/signup' }, 'Sign up')
          ])
        ])
      ])
    ])
  ])
}

function Footer (props) {
  return footer('.container-fluid.py-3', [
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

function MessageDesk (messages) {
  const msgTypes = Object.keys(messages)
  const alert = msgType => div(`.alert.alert-${msgType}`, messages[msgType])

  if (msgTypes.length > 0) { return div(msgTypes.map(alert)) }

  return null
}

module.exports = function Layout ({ page, messages }) {
  return div('#application', [
    CreateHeader(),
    MessageDesk(messages),
    page,
    Footer()
  ])
}
