const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const modal = require('./modal')
const { div, label, input, button, ul, li, h2, h6, p } = h

function Name ({ poll, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'name',
    value: poll.name
  }, errors, { placement: 'top' })

  return div('.form-row', [
    div('.col-auto', [
      label({ htmlFor: 'settings-name' }, 'Name'),
      input('#settings-name', options)
    ])
  ])
}

function Description ({ poll, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'description',
    value: poll.description
  }, errors)

  return div('.form-group.my-4', [
    label({ htmlFor: 'settings-description' }, 'Description'),
    input('#settings-description', options)
  ])
}

function MainOptions ({ poll, csrfToken, errors }) {
  const author = poll.author.username
  const pollname = poll.name

  return w.FormFor('#settings.pt-3', {
    action: w.path({ author, pollname, rest: 'settings' })
  }, [
    input({ name: '_csrf', value: csrfToken, type: 'hidden' }),

    Name({ poll, errors }),
    Description({ poll, errors }),

    button('.btn.btn-primary', { type: 'submit' }, 'Update')
  ])
}

function DangerZone () {
  return div('.border.border-danger.rounded.p-1', [
    ul('.list-group.list-group-flush', [
      li('.list-group-item', [
        button('.btn.btn-outline-danger.float-right.w-15',
          w.modalBtnAttributes('#delete-modal'),
          'Delete'
        ),

        h6('Deleter this poll'),
        p('Delete this poll.')
      ])
    ])
  ])
}

function Page (options) {
  return div('.container', [
    div('.border-bottom', [ h2('Settings') ]),
    MainOptions(options),

    div('.mt-5.py-3', [ h2('Danger Zone') ]),
    DangerZone(),

    modal.Delete(options)
  ])
}

module.exports = Page
