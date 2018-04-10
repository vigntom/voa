$('.btn-add-choice').on('click', () => {
  const $choiceGroup = $('.choice-group')
  const $choices = $choiceGroup.find('.choice')
  const $el = $choices.first().clone()
  const index = $choices.length

  const $choiceName = $el.find('.choice-name')
  $choiceName.val('')
  $choiceName.attr('name', `choices[${index}][name]`)

  const $choiceDesc = $el.find('.choice-description')
  $choiceDesc.val('')
  $choiceDesc.attr('name', `choices[${index}][description]`)

  $choiceGroup.append($el)

  // remove button shows only if more than 2 choices
  if ($('.choice').length === 3) {
    $('.choice').removeClass('choice-core')
  }
})

$('.choice-group').on('click', '.btn-del-choice', (e) => {
  $(e.target).closest('.choice').remove()

  // need at least 2 choices to show remove button
  if ($('.choice').length === 2) {
    $('.choice').addClass('choice-core')
  }
})

/* global $ */
