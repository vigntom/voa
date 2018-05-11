const R = require('ramda')
const NewOption = require('./new-option')
const h = require('../../helpers/hyperscript')
const pollChart = require('../../../../lib/poll-chart')

const { div, button, h5, span } = h

function ChoicesButton (options) {
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

function FreeChoice ({ isAuthenticated }) {
  if (!isAuthenticated) return null

  return div('.choices-free.d-flex.flex-column', [
    button('.btn.btn-choice-free.mt-3', {
      type: 'button',
      'data-toggle': 'modal',
      'data-target': '#new-choice'
    }, 'New option'),

    NewChoice()
  ])
}

function NewChoice () {
  return div('#new-choice.modal.fade', {
    tabIndex: '-1',
    role: 'dialog',
    'aria-labelledby': 'Create New Option',
    'aria-hidden': true
  }, [
    div('.modal-dialog.modal-dialog-centered', { role: 'document' }, [
      div('.modal-content', [
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
          button('.choice-free-submit.btn.w-100',
            { type: 'submit' },
            'Create'
          )
        ])
      ])
    ])
  ])
}

function ChoicesGroup ({ options }) {
  const length = options.length
  const idx = R.range(0, length)

  return div('.choices-voted.d-flex.flex-column', [
    R.map(ChoicesButton(options), idx)
  ])
}

function VoteBar ({ poll, isAuthenticated }) {
  const { options } = poll
  return div('.d-flex.flex-column.px-2.py-4', [
    ChoicesGroup({ options }),
    FreeChoice({ isAuthenticated })
  ])
}

function VoteDesk ({ poll, isVoted, isAuthenticated }) {
  if (isVoted) return null

  return div('.vote-col.col-3.pl-3.pr-2', {
  }, [ VoteBar({ poll, isAuthenticated }) ])
}

module.exports = VoteDesk
