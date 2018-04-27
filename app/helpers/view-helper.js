const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const pluralize = require('pluralize')
const crypto = require('crypto')
const querystring = require('querystring')
const { form, div, ul, li, image, nav, a, span, h2, button, i, p } = hh(h)

function md5 (string) {
  return crypto.createHash('md5')
    .update(string)
    .digest('hex')
}

function FormFor (selector, params, children) {
  const defaultParams = { acceptCharset: 'UTF-8', method: 'post' }
  const formParams = Object.assign({}, defaultParams, params)

  return form(selector, formParams, children)
}

function MessageDesk (messages) {
  const msgTypes = Object.keys(messages)
  const alert = msgType => {
    const message = messages[msgType]

    if (message.type) return AlertBox(message)

    return AlertBox({
      type: msgType,
      msg: messages[msgType]
    })
  }

  function AlertBox ({ type, msg }) {
    return div(`.alert.alert-${type}.alert-dismissible.fade.show.stack-level-3`, {
      role: 'alert'
    }, [
      msg,

      button('.close', {
        type: 'button',
        'data-dismiss': 'alert',
        'aria-label': 'close'
      }, [ span({ 'aria-hidden': true }, '×') ])
    ])
  }

  if (msgTypes.length > 0) {
    return div('.alert.alert-fadable.fade.show.m-0', msgTypes.map(alert))
  }

  return null
}

function maybeError (options, errors, { path, placement }) {
  const name = path || options.name

  if (!errors) { return options }

  if (errors[name]) {
    const title = errors[name]
    return Object.assign({}, options, {
      className: 'is-invalid',
      'data-toggle': 'tooltip',
      title: typeof title === 'string' ? title : title.msg,
      'data-placement': placement
    })
  }

  return Object.assign({}, options, { className: 'is-valid' })
}

function gravatarUrl (email, size = 80) {
  return `https://secure.gravatar.com/avatar/${md5(email)}?s=${size}`
}

function Gravatar ({ user, size, className }) {
  return image('.gravatar.rounded', {
    src: gravatarUrl(user.email, size),
    alt: user.username,
    className
  })
}

function Email ({ user, className, linkClass }) {
  if (user.emailProtected) { return null }

  return p({ className }, [
    span('.oi.oi-envelope-closed.pr-2.text-muted'),
    a({ href: `mailto: ${user.email}`, className: linkClass }, user.email)
  ])
}

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

function StandardBar ({ className, paginate, pageCount, pages }) {
  return ul('.pagination', { className }, [].concat(
    PaginationPrevious({ paginate, pageCount }),
    PaginationFirst({ paginate, pageCount }),
    PaginationBeforeGap({ pages, pageCount }),
    PaginationBar({ paginate, pages, pageCount }),
    PaginationAfterGap({ pages, pageCount }),
    PaginationLast({ paginate, pageCount }),
    PaginationNext({ paginate, pageCount })
  ))
}

function PaginationNavBar (options, nest) {
  const { paginate, pageCount } = options

  if (paginate.hasPreviousPages || paginate.hasNextPages(pageCount)) {
    return nav({ 'aria-label': options['aria-label'] }, nest)
  }
}

function InfoBar ({ path, info, menuItem }, dropdown) {
  return div('.info-bar.d-flex.pb-3', [
    h2('.h3.mr-auto', info),
    div('.dropdown', [
      button('#pollSortButton.btn.btn-sm.btn-outline-secondary.dropdown-toggle', {
        type: 'button',
        'data-toggle': 'dropdown',
        'aria-haspopup': true,
        'aria-expanded': false
      }, [
        i('Sort: '),
        span('.js-select-btn', menuItem)
      ]),
      dropdown
    ])
  ])
}

function SortGroup (options) {
  const { users, polls, pollsCount, usersCount, query } = options
  const queryStr = query ? `?${querystring.stringify(query)}` : ''

  function maybeSelected (cond) {
    const style = '.list-group-item'
    if (cond) { return style + '.selected' }
    return style
  }

  return div('.list-group', [
    a(maybeSelected(polls), { href: '/polls' + queryStr }, [
      'Polls',
      span('.counter.badge.badge-pill.float-right', pollsCount)
    ]),
    a(maybeSelected(users), { href: '/users' + queryStr }, [
      'Users',
      span('.counter.badge.badge-pill.float-right', usersCount)
    ])
  ])
}

function PaginationStdBar ({ pageCount, pages, paginate }) {
  return PaginationNavBar({
    'aria-label': 'Users index navigation',
    paginate,
    pageCount
  }, [ StandardBar({
    className: 'pt-4 pb-5 justify-content-center',
    paginate,
    pageCount,
    pages
  })])
}

module.exports = {
  FormFor,
  MessageDesk,
  maybeError,
  Gravatar,
  Email,
  SortGroup,
  InfoBar,
  PaginationStdBar
}
