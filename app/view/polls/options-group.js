const R = require('ramda')
const classnames = require('classnames')
const h = require('../helpers/hyperscript')
const w = require('../helpers')

const { div, input, button, span } = h

function UpdateOrDeleteButtons (id) {
  const editOptions = { type: 'submit' }
  const deleteOptions = w.modalBtnAttributes('#delete-option-modal')

  return div('.btn-accept-group.accept-update',
    button('.btn-edit-option.btn.btn-outline-success.mx-1',
      editOptions,
      span('.oi.voa-oi-sm.oi-check')
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
      type: 'submit',
      disabled: true,
      'data-disable-invalid': true
    }, 'Add')
  )
}

function OptionsItem (options) {
  const { item } = options
  const id = item._id && item._id.toString()
  const Button = id ? UpdateOrDeleteButtons(id) : AddButton()
  const baseClass = 'choice form-row pb-1 confirmable'
  const className = classnames(
    baseClass, {
      'update-option': !!id,
      'add-option': !id
    }
  )

  return w.FormFor('', { action: '#', className }, [
    div('.col-4', [
      input({ type: 'hidden', name: 'id', value: id }),
      input('.form-control', {
        type: 'text',
        placeholder: 'Choice name',
        name: 'name',
        value: item.name,
        required: true,
        pattern: '\\S(.*\\S)?'
      })
    ]),

    div('.col', [
      input('.form-control', {
        type: 'text',
        placeholder: 'description (optional)',
        name: 'description',
        value: item.description
      })
    ]),

    Button
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
