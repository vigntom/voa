const R = require('ramda')
const classnames = require('classnames')
const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const pollChart = require('../../../../lib/poll-chart')

const { div, button, h5, span, input } = h

function NewOption ({ errors, isDeletable, value = {} }) {
  const options = w.maybeError({
    className: 'choice-name form-control',
    type: 'text',
    name: `name`,
    placeholder: 'Name',
    value: value.name,
    autoFocus: true,
    required: true
  }, errors, { path: 'name', placement: 'left' })

  return div({
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
  ])
}

function NewOptionModal () {
  return div('#new-choice.modal.fade', {
    tabIndex: '-1',
    role: 'dialog',
    'aria-labelledby': 'Create New Option',
    'aria-hidden': true
  }, [
    div('.modal-dialog.modal-dialog-centered', { role: 'document' }, [
      div('.modal-content.confirmable', [
        div('.modal-header', [
          h5('.modal-title', 'Add your option'),

          button('.close', {
            type: 'button',
            'data-dismiss': 'modal',
            'aria-label': 'Close'
          }, [ span({ 'aria-hidden': true }, '×') ])
        ]),

        div('.modal-body', [
          NewOption({ isDeletable: false })
        ]),

        div('.modal-footer', [
          button('.btn.btn-outline-secondary.btn-block',
            { type: 'submit', disabled: true, 'data-disable-invalid': true },
            'Create'
          )
        ])
      ])
    ])
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

    NewOptionModal()
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
