const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')

const { div, h2, h5, input, button, span, label } = hh(h)

function Author (author) {
  return div('.form-group.col-auto', [
    label({ htmlFor: '#poll-authorname' }, 'Author'),

    input('#poll-authorname.form-control.d-inline', {
      type: 'text',
      readOnly: true,
      name: 'author-name',
      value: author,
      size: author.length
    })
  ])
}

function Slash () {
  return div('.col-auto', [
    div('.slash', [ span('/') ])
  ])
}

function Name () {
  return div('.form-group.col-auto', [
    label({ htmlFor: 'poll-name' }, 'Poll name'),
    input('#poll-name.form-control', {
      type: 'text',
      name: 'name',
      placeholder: 'Poll name'
    })
  ])
}

function Description () {
  return div('.form-group', [
    label({ htmlFor: 'poll-description' }, 'Description (optional)'),
    input('#poll-description.form-control', {
      type: 'text',
      name: 'description',
      placeholder: 'description'
    })
  ])
}

function PollName ({ author }) {
  return div('.form-row', [ Author(author), Slash(), Name() ])
}

function ChoiceItem () {
  return div(`.choice.choice-core.form-row.pb-1`, [
    div('.col-4', [
      input('.form-control', {
        type: 'text',
        name: `choices[][name]`,
        placeholder: 'Choice name'
      })
    ]),

    div('.col', [
      input('.form-control', {
        type: 'text',
        name: `choices[][description]`,
        placeholder: 'description (optional)'
      })
    ]),

    button('.btn-del-choice.btn.btn-outline-danger', {
      type: 'button'
    }, [ span('.oi.voa-oi-sm.oi-x') ])
  ])
}

module.exports = function New ({ poll, author, flash, csrfToken }) {
  return div('.main.container.mt-3', [
    div('.voa-board.w-75.m-auto', [
      w.MessageDesk(flash),
      div('.voa-item', [ h2('Create a new poll') ]),
      w.FormFor('#new-poll', { action: '/polls' }, [
        input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
        input('#poll-author', { type: 'hidden', name: 'author', value: poll.author }),

        div('.voa-item', [ PollName({ author }), Description() ]),

        div('.voa-item.clearfix', [
          h5('Poll choises'),

          div('.choice-group.form-group', [
            ChoiceItem(),
            ChoiceItem()
          ]),

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
