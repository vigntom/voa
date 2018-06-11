const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const { div, label, input, button } = h

function DeleteModal ({ poll, csrfToken }) {
  const author = poll.author.username
  const pollname = poll.name

  return w.Modal({ id: 'delete-modal', title: 'Delete Poll' }, [
    w.FormFor('#delete-poll.confirmable', { action: w.path({ author, pollname }) }, [
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
          pattern: w.createConfirmPattern(poll.name)
        })
      ]),

      button('.btn.btn-outline-danger.btn-block',
        { type: 'submit', disabled: true, 'data-disable-invalid': true },
        'Delete Poll'
      )
    ])
  ])
}

module.exports = {
  Delete: DeleteModal
}
