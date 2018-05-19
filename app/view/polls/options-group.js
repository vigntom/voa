const R = require('ramda')
const h = require('../helpers/hyperscript')
const w = require('../helpers')

const { div, input, button, span } = h

function UpdateOrDeleteButtons (id) {
  const editOptions = { type: 'button' }
  const deleteOptions = w.modalBtnAttributes('#delete-option-modal')

  return div('.btn-accept-group.accept-update',
    button('.btn-edit-option.btn.btn-outline-primary.mx-1',
      editOptions,
      span('.oi.voa-oi-sm.oi-pencil')
    ),

    button('.btn-del-option.btn.btn-outline-danger.mx-1',
      deleteOptions,
      [ span('.oi.voa-oi-sm.oi-x') ]
    )
  )
}

function AddButton () {
  return div('.btn-accept-group.accept-new.px-1',
    button('.btn.btn-add-choice.btn-primary.btn-block', {
      disabled: true,
      'data-disable-invalid': true
    }, 'Add')
  )
}

function OptionsItem (options) {
  const { item } = options

  return div('.choice.form-row.pb-1.confirmable', {
    'data-option-id': item._id || 'null'
  }, [
    div('.col-4', [
      input('.choice-name.form-control', {
        type: 'text',
        placeholder: 'Choice name',
        value: item.name,
        required: true,
        pattern: '\\S+'
      })
    ]),

    div('.col', [
      input('.choice-description.form-control', {
        type: 'text',
        placeholder: 'description (optional)',
        value: item.description
      })
    ]),

    item._id ? UpdateOrDeleteButtons(item._id) : AddButton()
  ])
}

function OptionsGroupBlock ({ poll }) {
  const options = poll.options || [{}, {}]
  const count = options.length

  return div('.options-group-block', [
    R.map(
      i => OptionsItem({ item: options[i] }),
      R.range(0, count)
    ),

    OptionsItem({ item: {} })
  ])
}

module.exports = OptionsGroupBlock
