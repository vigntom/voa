const R = require('ramda')
const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const ChoiceItem = require('../choice-item')

const { div, h2, input, button, span } = h

function Options ({ poll, csrfToken, errors }) {
  const author = poll.author.username
  const pollname = poll.name
  const options = poll.options
  const count = options.length
  const isDeletable = count > 2

  return w.FormFor('#options.voa-board', {
    action: w.path({ author, pollname, rest: 'options' })
  }, [
    input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),

    div('.voa-item.clearfix', [
      div('.choice-group',
        R.map(
          i => ChoiceItem({ item: options[i], isDeletable }),
          R.range(0, count)
        )
      ),

      button('.btn.btn-outline-primary.btn-sm.btn-add-choice.float-left.mt-1', {
        type: 'button'
      }, [ span('.oi.voa-oi-sm.oi-plus') ])
    ]),

    div('.voa-item', [
      button('.btn.btn-success', { type: 'submit' }, 'Update')
    ])
  ])
}

function Page (options) {
  return div('.container', [
    div('.border-bottom', h2('Options')),
    Options(options)
  ])
}

module.exports = Page
