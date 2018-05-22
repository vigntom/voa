const w = require('../helpers')
const h = require('../helpers/hyperscript')

const { div, h2, label, input, button, span } = h

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

function Name ({ name, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    type: 'text',
    name: 'name',
    value: name,
    autoFocus: true
  }, errors, { placement: 'right' })

  return div('.form-group.col-auto', [
    label({ htmlFor: 'poll-name' }, 'Name'),
    input('#poll-name', options)
  ])
}

function Description ({ poll, errors }) {
  const { description } = poll
  const options = w.maybeError({
    className: 'form-control',
    type: 'text',
    name: 'description',
    value: description
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'poll-description' }, 'Question'),
    input('#poll-description', options)
  ])
}

function PollName ({ author, poll, errors }) {
  const { name } = poll

  return div('.form-row', [
    Author(author),

    div('.col-auto', [
      div('.slash', [ span('/') ])
    ]),

    Name({ name, errors })
  ])
}

function Settings (options) {
  const { author, poll, errors, csrfToken } = options

  return w.FormFor('#new-poll', { action: w.path({ author }) }, [
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
