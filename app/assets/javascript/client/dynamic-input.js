export default function () {
  $('.btn-add-choice').on('click', () => {
    const $choiceGroup = $('.choice-group')
    const $choices = $choiceGroup.find('.choice')
    const $el = $choices.first().clone()
    const index = $choices.length

    const $choiceName = $el.find('.choice-name')

    $el.attr('data-option-new', true)

    $choiceName.val('')
    $choiceName.attr('name', `options[new][${index}][name]`)

    const $choiceDesc = $el.find('.choice-description')
    $choiceDesc.val('')
    $choiceDesc.attr('name', `options[new][${index}][description]`)

    $choiceGroup.append($el)

    // remove button shows only if more than 2 choices
    if ($('.choice').length === 3) {
      $('.choice').removeClass('choice-core')
    }
  })

  $('.choice-group').on('click', '.btn-del-choice', (e) => {
    const $el = $(e.target).closest('.choice')
    const isNew = $el.attr('data-option-new')

    if (!isNew) {
      const $choiceName = $el.find('.choice-name')
      const $choiceDesc = $el.find('.choice-description')
      const id = $el.attr('data-options-id')

      $choiceName.attr('name', `options[remove][${id}][name]`)
      $choiceDesc.attr('name', `options[remove][${id}][description]`)
    }

    $el.hide()

    // need at least 2 choices to show remove button
    if ($('.choice').length === 2) {
      $('.choice').addClass('choice-core')
    }
  })
}

/* global $ */
