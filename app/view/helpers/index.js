const R = require('ramda')
const classnames = require('classnames')
const crypto = require('crypto')
const h = require('./hyperscript')
const querystring = require('querystring')
const { form, div, a, img, span, h2, h5, button, i, p } = h

function md5 (string) {
  return crypto.createHash('md5')
    .update(string)
    .digest('hex')
}

function createConfirmPattern (str, option = {}) {
  const transform = transormation(option)
  const regexp = str.split('').map(transform).join('')

  function transormation (option) {
    if (option.lowerCase) { return x => `[${x.toLowerCase()}]` }
    if (option.upperCase) { return x => `[${x.toUpperCase()}]` }

    return x => `[${x.toLowerCase()}${x.toUpperCase()}]`
  }

  return `^${regexp}$`
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
  const formParams = R.merge(defaultParams, params)

  return form(selector, formParams, children)
}

function MessageDesk (messages) {
  if (!messages) return null

  function alert (msgType) {
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

  const msgTypes = R.keys(messages)

  if (msgTypes.length > 0) {
    return div('.alert.alert-fadable.fade.show.m-0', msgTypes.map(alert))
  }

  return null
}

function maybeError (options, errors, tooltip = {}) {
  const name = tooltip.path || options.name
  const placement = tooltip.placement || 'auto'

  if (!errors) { return options }

  if (errors[name]) {
    const error = errors[name]
    const title = typeof error === 'string' ? error : error.message

    return R.merge(options, {
      'data-toggle': 'tooltip',
      title: title,
      'data-placement': placement,
      className: classnames(options.className, 'is-invalid')
    })
  }

  return R.merge(options, {
    className: classnames(options.className, 'is-valid')
  })
}

function Gravatar ({ user, size, className }) {
  function gravatarUrl (email, size = 80) {
    return `https://secure.gravatar.com/avatar/${md5(email)}?s=${size}`
  }

  return img({
    src: gravatarUrl(user.email, size),
    alt: user.username,
    className: classnames('gravatar', 'rounded', className)
  })
}

function Email ({ user, className, linkClass }) {
  if (user.emailProtected) { return null }

  return p({ className }, [
    span('.oi.oi-envelope-closed.pr-2.text-muted'),
    a({ href: `mailto: ${user.email}`, className: linkClass }, user.email)
  ])
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
  return a({ href, className: classnames('list-group-item', { selected: cond }) }, nest)
}

function SortGroup (options) {
  const { users, polls, pollsCount, usersCount } = options
  const query = type => R.merge(options.query, { type })
  const qToString = type => querystring.stringify(query(type))

  return div('.list-group', [
    GroupLink({ cond: !!polls, href: `/search?${qToString('poll')}` }, [
      'Polls',
      span('.counter.badge.badge-pill.float-right', pollsCount)
    ]),

    GroupLink({ cond: !!users, href: `/search?${qToString('user')}` }, [
      'Users',
      span('.counter.badge.badge-pill.float-right', usersCount)
    ])
  ])
}

function modalBtnAttributes (target) {
  return {
    type: 'button',
    'data-toggle': 'modal',
    'data-target': target
  }
}

function Modal ({ id, title }, nest) {
  const options = {
    id,
    tabIndex: '-1',
    role: 'dialog',
    'aria-labelledby': title,
    'aria-hidden': true
  }

  return div('.modal.fade', options, [
    div('.modal-dialog.modal-dialog-centered', { role: 'document' }, [
      div('.modal-content', [
        div('.modal-header', [
          h5('.modal-title', title),

          button('.close', {
            type: 'button',
            'data-dismiss': 'modal',
            'aria-label': 'Close'
          }, [ span({ 'aria-hidden': true }, '×') ])
        ]),

        div('.modal-body', nest)
      ])
    ])
  ])
}

module.exports = {
  FormFor,
  MessageDesk,
  maybeError,
  Gravatar,
  Email,
  SortGroup,
  InfoBar,
  GroupLink,
  path,
  createConfirmPattern,
  modalBtnAttributes,
  Modal
}
