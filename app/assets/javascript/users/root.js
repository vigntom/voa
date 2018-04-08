const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const dateFormat = require('dateformat')

const { div, ul, li, a, h4, time, p } = hh(h)

function AdminDeleteLink ({ current, user }) {
  if (current.admin && current._id.toString() !== user._id.toString()) {
    return a({
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
      return li('.col', [
        div('.d-flex', [
          div('.pr-1', [ w.Gravatar({ user, size: 64 }) ]),
          div('.pl-1', [
            h4([ a({ href: `/users/${user._id}` }, user.username) ]),
            p('.m-0', [ 'Polls ', user.polls ])
          ])
        ]),
        div('.pt-1.mt-3', [
          p('.m-0', [ 'Joined on ', time(dateFormat(user.activatedAt, 'mediumDate')) ]),
          p('.m-0.mt-2', [ AdminDeleteLink({ current, user }) ])
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
    div('.row', [
      div('.col-3', [ w.SortGroup(options) ]),
      div('.col', [ w.InfoBar({ info, menuItem }, Dropdown({ path })), UsersList(options) ])
    ]),
    w.PaginationStdBar(options)
  ])
}
