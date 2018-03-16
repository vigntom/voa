const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { Gravatar, MessageDesk } = require('../../../helpers/view-helper')

const { div, h1, ul, li, span, a, nav } = hh(h)

function PaginationPrevious ({ paginate, pageCount }) {
  if (pageCount > 1) {
    const disabled = (paginate.page < 2) ? '.disabled' : ''
    return li(`.page-item${disabled}`, [
      a('.page-link', { href: paginate.href(true) }, 'Previous')
    ])
  }
}

function PaginationBar ({ paginate, pages, pageCount }) {
  if (pages.length > 3) {
    const active = x => (paginate.page === x) ? '.active' : ''

    return pages.map(({ number, url }) => {
      if (number === 1) { return }
      if (number === pageCount) { return }

      return li(`.page-item${active(number)}`, [
        a('.page-link', { href: url }, number)
      ])
    }
    )
  }
}

function PaginationNext ({ paginate, pageCount }) {
  if (pageCount > 1) {
    const disabled = paginate.hasNextPages(pageCount) ? '' : '.disabled'
    return li(`.page-item${disabled}`, [
      a('.page-link', { href: paginate.href() }, 'Next')
    ])
  }
}

function PaginationFirst ({ paginate, pageCount }) {
  if (pageCount > 0) {
    const active = paginate.page === 1 ? '.active' : ''

    return li(`.page-item${active}`, [
      a('.page-link', {
        href: paginate.href({ page: 1 })
      }, '1')
    ])
  }
}

function PaginationLast ({ paginate, pageCount }) {
  if (pageCount > 2) {
    const active = paginate.page === pageCount ? '.active' : ''

    return li(`.page-item${active}`, [
      a('.page-link', { href: paginate.href({ page: pageCount }) }, pageCount)
    ])
  }
}

function PaginationBeforeGap ({ pages, pageCount }) {
  if (pageCount > 3) {
    if (pages[0].number - 1 > 1) {
      return li('.page-item.disabled', [ span('.page-link', '...') ])
    }
  }
}

function PaginationAfterGap ({ pages, pageCount }) {
  if (pageCount > 3) {
    if (pageCount - pages[pages.length - 1].number > 1) {
      return li('.page-item.disabled', [ span('.page-link', '...') ])
    }
  }
}

function PaginationNavBar ({ paginate, pageCount, pages }) {
  if (paginate.hasPreviousPages || paginate.hasNextPages(pageCount)) {
    return nav({ 'aria-label': 'Users index navigation' }, [
      ul('.pagination', [].concat(
        PaginationPrevious({ paginate, pageCount }),
        PaginationFirst({ paginate, pageCount }),
        PaginationBeforeGap({ pages, pageCount }),
        PaginationBar({ paginate, pages, pageCount }),
        PaginationAfterGap({ pages, pageCount }),
        PaginationLast({ paginate, pageCount }),
        PaginationNext({ paginate, pageCount })
      ))
    ])
  }
}

function AdminDeleteLink ({ current, user }) {
  if (current.admin && current._id.toString() !== user._id.toString()) {
    return div('.d-inline', [' | ',
      a({
        href: `/users/${user._id}`,
        'data-method': 'delete',
        'data-confirm': 'You shure?'
      }, 'Delete')
    ])
  }
}

module.exports = function Index (options) {
  const { users, session } = options
  const { pageCount, pages, paginate } = options
  const current = session.user

  return div('.main.container-fluid', [
    MessageDesk(options.flash),
    h1('.page-header', 'All users'),
    PaginationNavBar({ paginate, pageCount, pages }),
    ul('.users',
      users.map(user => {
        return li([
          Gravatar({ user, size: 50 }),
          a({ href: `/users/${user._id}` }, user.username),
          AdminDeleteLink({ current, user })
        ])
      })
    )
  ])
}
