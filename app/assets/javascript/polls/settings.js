const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const EditGroup = require('./_edit-group')

const { div, h1, h2, h5, h6, a, p, span, ul, li, input, label, button } = hh(h)

function Page (options) {
  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        Header(options),
        PollTabNavBar(options)
      ])
    ]),

    div('.bg-white', [
      div('.container.py-5', [
        w.MessageDesk(options.flash),
        div('.row.justify-content-center.bg-white', [
          div('.col-3', [ EditGroup(options) ]),
          div('.col-7', [ Settings(options) ])
        ])
      ])
    ])
  ])
}

function Header ({ poll }) {
  const { author, name } = poll
  return div('.py-3', [
    h1('.h3', [
      a({ href: `/ui/${author.username}` }, author.username),
      span('.slash', ' / '),
      a({ href: `/ui/${author.username}/${name}` }, name)
    ])
  ])
}

function PollTabNavBar ({ poll }) {
  const { author, name } = poll

  return ul('.nav.nav-tabs.container.border-0', [
    li('.nav-item', [
      a('.nav-link.text-muted', { href: `/ui/${author.username}/${name}` }, [
        span('.oi.oi-bar-chart.pr-1'),
        'Poll'
      ])
    ]),

    li('.nav-item', [
      a('.nav-link.active', { href: `/ui/${author.username}/${name}/settings` }, [
        span('.oi.oi-cog.pr-1'),
        'Settings'
      ])
    ])
  ])
}

function Settings (options) {
  return div('.container', [
    div('.border-bottom', [ h2('Settings') ]),
    MainOptions(options),

    div('.mt-5.py-3', [ h2('Danger Zone') ]),
    DangerZone(),

    TransferModal(options),
    DeleteModal(options)
  ])
}

function MainOptions ({ poll, csrfToken, errors }) {
  const author = poll.author.username
  const pollname = poll.name

  return w.FormFor('#settings.pt-3', { action: `/ui/${author}/${pollname}/settings` }, [
    input({ name: '_csrf', value: csrfToken, type: 'hidden' }),

    Name({ poll, errors }),
    Description({ poll, errors }),

    button('.btn.btn-primary', { type: 'submit' }, 'Update')
  ])
}

function DangerZone () {
  const modalButton = target => ({
    type: 'button',
    'data-toggle': 'modal',
    'data-target': target
  })

  return div('.border.border-danger.rounded.p-1', [
    ul('.list-group.list-group-flush', [
      li('.list-group-item', [
        button('.btn.btn-outline-danger.float-right.w-15',
          modalButton('#transfer-modal'),
          'Transfer'
        ),

        h6('Transfer ownership'),
        p('Transfer this poll to another user')
      ]),

      li('.list-group-item', [
        button('.btn.btn-outline-danger.float-right.w-15',
          modalButton('#delete-modal'),
          'Delete'
        ),

        h6('Deleter this poll'),
        p('Delete this poll.')
      ])
    ])
  ])
}

function Name ({ poll, errors }) {
  const options = w.maybeError({
    name: 'name',
    defaultValue: poll.name
  }, errors, { placement: 'top' })

  return div('.form-row', [
    div('.col-auto', [
      label({ htmlFor: 'settings-name' }, 'Name'),
      input('#settings-name.form-control', options)
    ])
  ])
}

function Description ({ poll, errors }) {
  const options = w.maybeError({
    name: 'description',
    defaultValue: poll.description
  }, errors)

  return div('.form-group.my-4', [
    label({ htmlFor: 'settings-description' }, 'Description'),
    input('#settings-description.form-control', options)
  ])
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

function createPattern (str) {
  const regexp = str.split('').map(x => `[${x.toLowerCase()}${x.toUpperCase()}]`).join('')
  return `^${regexp}$`
}

function TransferModal ({ poll, csrfToken }) {
  const author = poll.author.username
  const pollname = poll.name

  return Modal({ id: 'transfer-modal', title: 'Transfer Poll' }, [
    w.FormFor('#transfer-poll.confirmable', {
      action: `/ui/${author}/${pollname}/transfer`
    }, [
      input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),

      div('.form-group', [
        label(
          { htmlFor: '#transfer-confirmation' },
          'Type the name of the poll to confirm'
        ),

        input('#transfer-confirmation.form-control', {
          type: 'text',
          name: 'confirmation',
          autoFocus: true,
          required: true,
          pattern: createPattern(poll.name)
        })
      ]),

      div('.form-group', [
        label(
          { htmlFor: '#transer-receiver' },
          'Username or email addres of the new owner of the Poll'
        ),

        input('#transfer-receiver.form-control', {
          type: 'text',
          name: 'author',
          required: true
        })
      ]),

      button('.btn.btn-outline-danger.btn-block',
        { type: 'submit', disabled: true, 'data-disable-invalid': true },
        'Transfer Poll'
      )
    ])
  ])
}

function DeleteModal ({ poll, csrfToken }) {
  const author = poll.author.username
  const pollname = poll.name

  return Modal({ id: 'delete-modal', title: 'Delete Poll' }, [
    w.FormFor('#delete-poll.confirmable', { action: `/ui/${author}/${pollname}` }, [
      input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
      input({ type: 'hidden', name: '_method', value: 'delete' }),

      div('.form-group', [
        label(
          { htmlFor: '#delete-confirmation' },
          'Type the name of the poll to conirm'
        ),

        input('#delete-confirmation.form-control', {
          type: 'text',
          name: 'confirmation',
          autoFocus: true,
          required: true,
          pattern: createPattern(poll.name)
        })
      ]),

      button('.btn.btn-outline-danger.btn-block',
        { type: 'submit', disabled: true, 'data-disable-invalid': true },
        'Delete Poll'
      )
    ])
  ])
}

module.exports = Page
