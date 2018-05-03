const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const R = require('ramda')
const ChoiceItem = require('./_choice-item')

const { div, h2, label, input, button, span, h5 } = hh(h)

function createOrUseChoices (choices) {
  if (choices && choices.length > 0) {
    return choices
  }

  return [{ name: '', description: '' }, { name: '', description: '' }]
}

function Author (value) {
  return div('.form-group.col-auto', [
    label({ htmlFor: '#poll-authorname' }, 'Author'),

    input('#poll-authorname.form-control.d-inline', {
      type: 'text',
      readOnly: true,
      name: 'author-name',
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
    placeholder: 'Poll name',
    defaultValue: name
  }, errors, { placement: 'right' })

  return div('.form-group.col-auto', [
    label({ htmlFor: 'poll-name' }, 'Poll name'),
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
    placeholder: 'question',
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
  const { author, poll, errors, csrfToken, action } = options
  const choices = createOrUseChoices(poll.choices)
  const isDeletable = choices.length > 2

  function requestMethod ({ method }) {
    if (!method) return null

    return input({ name: '_method', value: method, type: 'hidden' })
  }

  return w.FormFor('#new-poll', { action: action.link }, [
    input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
    requestMethod(action),

    div('.voa-item', [
      PollName({ author, poll, errors }),
      Description({ poll, errors })
    ]),

    div('.voa-item.clearfix', [
      h5('Poll choises'),

      div('.choice-group.form-group',
        R.map(
          x => ChoiceItem({ index: x, value: choices[x], errors, isDeletable })
        )(R.range(0, choices.length))
      ),

      button('.btn-add-choice.btn.btn-outline-primary.btn-sm.float-right', {
        type: 'button'
      }, [ span('.oi.voa-oi-sm.oi-plus'), ' Add' ])
    ]),

    div('.voa-item', [
      button('.btn.btn-success', { type: 'submit' }, action.name)
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
