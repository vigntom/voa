const R = require('ramda')
const h = require('../../helpers/hyperscript')
const pollChart = require('../../../../lib/poll-chart')

const { div, button } = h

function FreeChoice ({ isAuthenticated }) {
  if (!isAuthenticated) return null

  return div('.choices-free.d-flex.flex-column', [
    button('.btn.btn-choice-free.mt-3', {
      type: 'button',
      'data-toggle': 'modal',
      'data-target': '#new-choice'
    }, 'New option')
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

function VoteDesk ({ poll, isVoted, isAuthenticated, noModal }) {
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
