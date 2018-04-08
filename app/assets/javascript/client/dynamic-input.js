$('.btn-add-choice').on('click', () => {
  const $choiceGroup = $('.choice-group')
  const $choices = $choiceGroup.find('.choice')

  $choiceGroup.append($choices.first().clone())

  if ($choices.length === 2) {
    $('.choice').removeClass('choice-core')
  }
})

$('.choice-group').on('click', '.btn-del-choice', (e) => {
  $(e.target).closest('.choice').remove()

  if ($('.choice').length === 2) {
    $('.choice').addClass('choice-core')
  }
})

/* global $ */
