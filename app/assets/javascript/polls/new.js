const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')

const { div, h2, label, input, button, span } = hh(h)

function Author (value) {
  return div('.form-group.col-auto', [
    label({ htmlFor: '#poll-authorname' }, 'Author'),

    input('#poll-authorname.form-control.d-inline', {
      type: 'text',
      readOnly: true,
      name: 'author',
      value
    })
  ])
}

function Slash () {
  return div('.col-auto', [
    div('.slash', [ span('/') ])
  ])
}

function Name ({ name, errors }) {
  const options = w.maybeError({
    type: 'text',
    name: 'name',
    defaultValue: name,
    autoFocus: true
  }, errors, { placement: 'right' })

  return div('.form-group.col-auto', [
    label({ htmlFor: 'poll-name' }, 'Name'),
    input(
      '#poll-name.form-control',
      w.maybeError(options, errors, { placement: 'right' })
    )
  ])
}

function Description ({ poll, errors }) {
  const { description } = poll
  const options = {
    type: 'text',
    name: 'description',
    defaultValue: description
  }

  return div('.form-group', [
    label({ htmlFor: 'poll-description' }, 'Question'),
    input(
      '#poll-description.form-control',
      w.maybeError(options, errors, { placement: 'top' })
    )
  ])
}

function PollName ({ author, poll, errors }) {
  const { name } = poll

  return div('.form-row', [
    Author(author),
    Slash(),
    Name({ name, errors })
  ])
}

function Settings (options) {
  const { author, poll, errors, csrfToken } = options

  return w.FormFor('#new-poll', { action: `/ui/${author}` }, [
    input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),

    div('.voa-item', [
      PollName({ author, poll, errors }),
      Description({ poll, errors })
    ]),

    div('.voa-item', [
      button('.btn.btn-success', { type: 'submit' }, 'Create')
    ])
  ])
}

module.exports = function New (options) {
  return div('.main.container.mt-3', [
    div('.voa-board.w-75.m-auto', [
      w.MessageDesk(options.flash),
      div('.voa-item', [ h2('Create a new poll') ]),
      Settings(options)
    ])
  ])
}
