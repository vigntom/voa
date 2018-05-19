const h = require('../helpers/hyperscript')
const w = require('../helpers')
const { div, label, input, button } = h

function Delete ({ poll, csrfToken }) {
  return w.Modal({ id: 'delete-option-modal', title: 'Deleto option' }, [
    w.FormFor('#delete-option.confirmable', { action: '#' }, [
      div('.form-group', [
        label(
          { htmlFor: '#delete-option-confirmation' },
          'Type "DELETE" to confirm'
        ),

        input('#delete-option-confirmation.form-control', {
          type: 'text',
          name: 'confirmation',
          autoFocus: true,
          required: true,
          value: '',
          pattern: w.createConfirmPattern('delete', { upperCase: true })
        })
      ]),

      button('#delete-option-button.btn.btn-outline-danger.btn-block',
        { type: 'submit', disabled: true, 'data-disable-invalid': true },
        'Delete option'
      )
    ])
  ])
}

module.exports = {
  Delete
}
