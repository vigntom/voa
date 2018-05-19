const R = require('ramda')
const classnames = require('classnames')
const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const pollChart = require('../../../../lib/poll-chart')

const { div, button, span, input } = h

function NewOption ({ errors, isDeletable, value = {} }) {
  const options = w.maybeError({
    className: 'choice-name form-control',
    type: 'text',
    name: `name`,
    placeholder: 'Name',
    value: value.name,
    autoFocus: true,
    required: true,
    pattern: '\\S+'
  }, errors, { path: 'name', placement: 'left' })

  return div('.confirmable', [
    div({
      className: classnames('choice form-row pb-1', { 'choice-core': !isDeletable })
    }, [
      div('.col-4', [
        input(options)
      ]),

      div('.col', [
        input('.choice-description.form-control', {
          type: 'text',
          name: 'description',
          placeholder: 'description (optional)',
          value: value.description
        })
      ]),

      button('.btn-del-choice.btn.btn-outline-danger', {
        type: 'button'
      }, [ span('.oi.voa-oi-sm.oi-x') ])
    ]),

    button('.choice-free-submit.btn.btn-outline-primary.btn-block',
      { type: 'submit', disabled: true, 'data-disable-invalid': true },
      'Create'
    )
  ])
}

function FreeChoice ({ isAuthenticated }) {
  if (!isAuthenticated) return null

  return div('.choices-free.d-flex.flex-column', [
    button('.btn.btn-choice-free.mt-3', {
      type: 'button',
      'data-toggle': 'modal',
      'data-target': '#new-choice'
    }, 'New option'),

    w.Modal({
      id: 'new-choice',
      title: 'Create new option'
    }, NewOption({ isDeletable: false }))
  ])
}

function ChoicesGroup ({ options }) {
  const length = options.length
  const idx = R.range(0, length)

  function ChoiceButton (options) {
    const { scale } = pollChart(
      R.map(x => ({ votes: x.votes.length }), options)
    )

    return index => {
      const item = options[index]

      return button('.btn.btn-choice.my-1', {
        type: 'button',
        'data-toggle': 'tooltip',
        'data-placement': 'right',
        title: item.description,
        key: index,
        value: item._id.toString(),
        style: { background: scale.color(item.votes.length) }
      }, div(item.name))
    }
  }

  return div('.choices-voted.d-flex.flex-column', [
    R.map(ChoiceButton(options), idx)
  ])
}

function VoteDesk ({ poll, isVoted, isAuthenticated }) {
  if (isVoted) return null

  const { options } = poll

  return div('.vote-col.col-3.pl-3.pr-2', [
    div('.d-flex.flex-column.px-2.py-4', [
      ChoicesGroup({ options }),
      FreeChoice({ isAuthenticated })
    ])
  ])
}

module.exports = VoteDesk
