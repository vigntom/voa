const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const { div, label, input, button } = h

function TransferModal ({ poll, csrfToken }) {
  const author = poll.author.username
  const pollname = poll.name

  return w.Modal({ id: 'transfer-modal', title: 'Transfer Poll' }, [
    w.FormFor('#transfer-poll.confirmable', {
      action: w.path({ author, pollname, rest: 'transfer' })
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
          pattern: w.createConfirmPattern(poll.name)
        })
      ]),

      div('.form-group', [
        label(
          { htmlFor: '#transer-receiver' },
          'Username or email addres of the new owner of the Poll'
        ),

        input('#transfer-receiver.form-control', {
          type: 'text',
          name: 'recipient',
          required: true,
          pattern: '\\S+'
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
  Transfer: TransferModal,
  Delete: DeleteModal
}
