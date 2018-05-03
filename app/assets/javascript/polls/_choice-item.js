const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')

const { div, input, button, span } = hh(h)

function ChoiceItem (options) {
  const index = options.index || ''
  const value = options.value || {}
  const { errors, isDeletable } = options

  const nameOptions = {
    type: 'text',
    name: `choices[${index}][name]`,
    placeholder: 'Choice name',
    defaultValue: value.name
  }

  return div(`.choice.form-row.pb-1`, {
    className: isDeletable ? '' : 'choice-core'
  }, [
    div('.col-4', [
      input(
        '.choice-name.form-control',
        w.maybeError(nameOptions, errors, {
          path: `choices.${index}.name`,
          placement: 'left'
        })
      )
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

module.exports = ChoiceItem
