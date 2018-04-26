const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')

const { div, h1, p, a, span, canvas, input, label, button, ul, li } = hh(h)

function Header ({ _id, name, author }) {
  return div('.py-3', [
    h1('.h3', [
      a({ href: `/users/${author._id}` }, author.username),
      span('.slash', ' / '),
      a({ href: `/polls/${_id}` }, name)
    ])
  ])
}

function Description ({ description }) {
  return p('.h5.font-weight-normal.pt-3.pb-4', description)
}

function VoteBar ({ choices }) {
  return div('.px-2.py-4', [
    choices.map((x, i) => (
      div('.form-check.pb-1', { key: i }, [
        input(`#choce-${i}.form-check-input`, {
          type: 'radio',
          name: `choice`,
          value: x._id
        }),

        label('.form-check-label.pl-2', {
          forhtml: `choice-${i}`,
          'data-toggle': 'tooltip',
          'data-placement': 'right',
          title: x.description
        }, x.name)
      ])
    )),

    button('#voa-vote-btn.btn.btn-success.mt-4.px-5', { type: 'button' }, 'Vote')
  ])
}

function Presentation ({ choices }) {
  return div('.chart-container', [
    canvas('#poll-chart')
  ])
}

function Show ({ poll, isVoted }) {
  return div('.bg-white', [
    div('.container', [
      div('.row', [ Description(poll) ]),
      div('#vote-container.row.border.rounded.mb-5', {
        'data-poll-id': poll._id
      }, [
        div('.vote-col.col-4.pl-3.pr-2', {
          className: isVoted ? 'hide' : ''
        }, [ VoteBar(poll) ]),
        div('.chart-col.col-8.pl-2.pr-3.m-auto', [ Presentation(poll) ])
      ])
    ])
  ])
}

function PollTabNavBar ({ poll }) {
  return ul('.nav.nav-tabs.container.border-0', [
    li('.nav-item', [
      a('.nav-link.active', { href: `/polls/${poll._id}` }, [
        span('.oi.oi-bar-chart.pr-1'),
        'Poll'
      ])
    ]),

    li('.nav-item', [
      a('.nav-link.text-muted', { href: `/polls/${poll._id}/edit` }, [
        span('.oi.oi-cog.pr-1'),
        'Settings'
      ])
    ])
  ])
}

module.exports = function Page ({ poll, flash, isVoted }) {
  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        w.MessageDesk(flash),
        Header(poll),
        PollTabNavBar({ poll })
      ])
    ]),

    Show({ poll, isVoted })
  ])
}
