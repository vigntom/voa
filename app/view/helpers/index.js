const h = require('./hyperscript')
const crypto = require('crypto')
const querystring = require('querystring')
const { form, div, ul, li, img, nav, a, span, h2, button, i, p } = h

function md5 (string) {
  return crypto.createHash('md5')
    .update(string)
    .digest('hex')
}

function path ({ author, pollname, rest }) {
  const path = {
    author: author ? '/ui/' + author : '',
    pollname: pollname ? '/' + pollname : '',
    rest: rest ? '/' + rest : ''
  }

  if (!author && pollname) {
    throw new Error("Can't create path without author")
  }

  return path.author + path.pollname + path.rest
}

function FormFor (selector, params, children) {
  const defaultParams = { acceptCharset: 'UTF-8', method: 'post' }
  const formParams = Object.assign({}, defaultParams, params)

  return form(selector, formParams, children)
}

function MessageDesk (messages) {
  if (!messages) return null

  const alert = msgType => {
    const message = messages[msgType]

    if (message.type) return AlertBox(message)
    if (Array.isArray(message)) {
      return message.map(m => AlertBox({
        type: msgTypes,
        message: m
      }))
    }

    return AlertBox({
      type: msgType,
      message
    })
  }

  function AlertBox ({ type, message }) {
    return div(`.alert.alert-${type}.alert-dismissible.fade.show.stack-level-3`, {
      role: 'alert'
    }, [
      message,

      button('.close', {
        type: 'button',
        'data-dismiss': 'alert',
        'aria-label': 'close'
      }, [ span({ 'aria-hidden': true }, '×') ])
    ])
  }

  const msgTypes = Object.keys(messages)

  if (msgTypes.length > 0) {
    return div('.alert.alert-fadable.fade.show.m-0', msgTypes.map(alert))
  }

  return null
}

function maybeError (options, errors, tooltip = {}) {
  const name = tooltip.path || options.name
  const placement = tooltip.placement || 'top'

  if (!errors) { return options }

  if (errors[name]) {
    const error = errors[name]
    return Object.assign({}, options, {
      className: 'is-invalid',
      'data-toggle': 'tooltip',
      title: typeof error === 'string' ? error : error.message,
      'data-placement': placement
    })
  }

  return Object.assign({}, options, { className: 'is-valid' })
}

function gravatarUrl (email, size = 80) {
  return `https://secure.gravatar.com/avatar/${md5(email)}?s=${size}`
}

function Gravatar ({ user, size, className }) {
  return img({
    src: gravatarUrl(user.email, size),
    alt: user.username,
    className: 'gravatar rounded' + (className ? ` ${className}` : '')
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

function GroupLink ({ cond, href }, nest) {
  function maybeSelected (cond) {
    const style = '.list-group-item'
    if (cond) { return style + '.selected' }
    return style
  }

  const selector = maybeSelected(cond)
  return a(selector, { href }, nest)
}

function SortGroup (options) {
  const { users, polls, pollsCount, usersCount } = options
  const query = type => Object.assign({}, options.query, { type })
  const qtoString = type => querystring.stringify(query(type))
  // const queryStr = query ? `?${querystring.stringify(query)}` : ''

  return div('.list-group', [
    GroupLink({ cond: polls, href: '/search' + '?' + qtoString('poll') }, [
      'Polls',
      span('.counter.badge.badge-pill.float-right', pollsCount)
    ]),

    GroupLink({ cond: users, href: '/search' + '?' + qtoString('user') }, [
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
  PaginationStdBar,
  GroupLink,
  path
}
