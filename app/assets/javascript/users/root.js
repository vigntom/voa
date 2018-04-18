const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const dateFormat = require('dateformat')

const { div, ul, li, a, time, p, span } = hh(h)

function AdminDeleteLink ({ current, user }) {
  if (user.admin) { return null }
  if (user.protected) { return null }

  if (current && current.admin) {
    return a('.btn.btn-outline-dark.btn-sm', {
      href: `/users/${user._id}`,
      'data-method': 'delete',
      'data-confirm': 'You shure?'
    }, 'Delete')
  }
}

function UsersList (options) {
  const { users, session } = options
  const current = session.user

  return ul('.list-simple',
    users.map(user => {
      return li('.d-flex', [
        div([ w.Gravatar({ user, size: 48 }) ]),
        div('.ml-2.mr-auto', [
          div('.user-list', [
            a({ href: `/users/${user._id}` }, user.username),
            p([ 'Polls: ', user.polls ]),
            p('.small', [
              span('.oi.oi-envelope-closed.pr-2'),
              a('.text-muted', { href: `mailto:${user.email}` }, user.email)
            ]),
            p('.small.text-muted', [ 'Joined on ', time(dateFormat(user.activatedAt, 'mediumDate')) ])
          ])
        ]),

        div([
          p([ AdminDeleteLink({ current, user }) ])
        ])
      ])
    })
  )
}

function Dropdown ({ path }) {
  return div('.dropdown-menu.dropdown-menu-right', { 'aria-labelledby': 'dropdownMenuButton' }, [
    a('.dropdown-item', { href: `${path}?s=&o=desc` }, 'Best match'),
    a('.dropdown-item', { href: `${path}?s=joined&o=desc` }, 'Most recently joined'),
    a('.dropdown-item', { href: `${path}?s=joined&o=asc` }, 'Least recently joined'),
    a('.dropdown-item', { href: `${path}?s=polls&o=desc` }, 'Most polls'),
    a('.dropdown-item', { href: `${path}?s=polls&o=asc` }, 'Fewest polls')
  ])
}

module.exports = function Index (options) {
  const info = `Result: ${options.usersCount} users`
  const path = '/users'
  const menuItem = options.menuItem

  return div('.main.container.mt-3', [
    w.MessageDesk(options.flash),
    div('.row.justify-content-center', [
      div('.col-3', [ w.SortGroup(options) ]),
      div('.col-7', [ w.InfoBar({ info, menuItem }, Dropdown({ path })), UsersList(options) ])
    ]),
    w.PaginationStdBar(options)
  ])
}
