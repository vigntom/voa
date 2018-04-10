const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const R = require('ramda')
const w = require('../../../helpers/view-helper')

const { div, h2, h5, input, button, span, label } = hh(h)

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
  return div('.form-group.col-auto', [
    label({ htmlFor: 'poll-name' }, 'Poll name'),
    input('#poll-name.form-control', {
      type: 'text',
      name: 'name',
      placeholder: 'Poll name',
      defaultValue: name,
      className: w.maybeErrorField('name', errors)
    })
  ])
}

function Description (value) {
  return div('.form-group', [
    label({ htmlFor: 'poll-description' }, 'Description (optional)'),
    input('#poll-description.form-control', {
      type: 'text',
      name: 'description',
      placeholder: 'description',
      defaultValue: value
    })
  ])
}

function PollName ({ author, name, errors }) {
  return div('.form-row', [ Author(author), Slash(), Name({ name, errors }) ])
}

function ChoiceItem ({ index, value, errors }) {
  return div(`.choice.choice-core.form-row.pb-1`, [
    div('.col-4', [
      input('.choice-name.form-control', {
        type: 'text',
        name: `choices[${index}][name]`,
        placeholder: 'Choice name',
        defaultValue: value.name,
        className: w.maybeErrorField(`choices.${index}.name`, errors)
      })
    ]),

    div('.col', [
      input('.choice-description.form-control', {
        type: 'text',
        name: `choices[${index}][description]`,
        placeholder: 'description (optional)',
        defaultValue: value.description
      })
    ]),

    button('.btn-del-choice.btn.btn-outline-danger', {
      type: 'button'
    }, [ span('.oi.voa-oi-sm.oi-x') ])
  ])
}

function createOrUseChoices (choices) {
  if (choices && choices.length > 0) {
    return choices
  }

  return [{ name: '', description: '' }, { name: '', description: '' }]
}

module.exports = function New ({ poll, author, flash, errors, csrfToken }) {
  const choices = createOrUseChoices(poll.choices)
  return div('.main.container.mt-3', [
    div('.voa-board.w-75.m-auto', [
      w.MessageDesk(flash),
      w.ErrorMsg(errors),
      div('.voa-item', [ h2('Create a new poll') ]),
      w.FormFor('#new-poll', { action: '/polls' }, [
        input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),

        div('.voa-item', [
          PollName({ author, name: poll.name, errors }),
          Description(poll.description)
        ]),

        div('.voa-item.clearfix', [
          h5('Poll choises'),

          div('.choice-group.form-group',
            R.map(
              x => ChoiceItem({ index: x, value: choices[x], errors })
            )(R.range(0, choices.length))
          ),

          button('.btn-add-choice.btn.btn-outline-primary.btn-sm.float-right', {
            type: 'button'
          }, [ span('.oi.voa-oi-sm.oi-plus'), ' Add' ])
        ]),

        div('.voa-item', [
          button('.btn.btn-success', { type: 'submit' }, 'Create poll')
        ])
      ])
    ])
  ])
}
