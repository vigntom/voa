const w = require('../helpers')
const h = require('../helpers/hyperscript')

const { div, input, button, span } = h

function Option (options) {
  const value = options.value || {}
  const { errors, isDeletable } = options

  const nameOptions = {
    type: 'text',
    name: `name`,
    placeholder: 'Name',
    defaultValue: value.name
  }

  return div(`.choice.form-row.pb-1`, {
    className: isDeletable ? '' : 'choice-core'
  }, [
    div('.col-4', [
      input(
        '.choice-name.form-control',
        w.maybeError(nameOptions, errors, {
          path: 'name',
          placement: 'left'
        })
      )
    ]),

    div('.col', [
      input('.choice-description.form-control', {
        type: 'text',
        name: 'description',
        placeholder: 'description (optional)',
        defaultValue: value.description
      })
    ]),

    button('.btn-del-choice.btn.btn-outline-danger', {
      type: 'button'
    }, [ span('.oi.voa-oi-sm.oi-x') ])
  ])
}

module.exports = Option
