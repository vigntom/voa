export default function () {
  const $choiceGroup = $('.choice-group')
  const $deleteOption = $('#delete-option')
  const $deleteModal = $('#delete-option-modal')
  const $deleteBtn = $('#delete-option-button')

  function errMessage (error, path) {
    if (error.kind === 'unique') {
      return `${path} must be unique`
    }

    return error.message
  }

  function updateChoiceGroup (options) {
    $choiceGroup.empty().append($(options))
  }

  $deleteModal.on('show.bs.modal', e => {
    const $btn = $(e.relatedTarget)
    const id = $btn.closest('.choice').data('option-id')
    $deleteBtn.data('option-id', id)
  })

  $deleteOption.on('submit', e => {
    const id = $deleteBtn.data('option-id')
    const data = { poll: $choiceGroup.data('poll-id') }

    e.preventDefault()

    $.ajax({
      dataType: 'json',
      url: `/api/option/${id}`,
      method: 'delete',
      data
    }).done(res => {
      if (res.success) updateChoiceGroup(res.options)
    }).always(() => {
      $deleteModal.modal('toggle')
    })
  })

  $choiceGroup.on('click', '.btn-edit-option', e => {
    const $choice = $(e.target).closest('.choice')
    const poll = $choiceGroup.data('poll-id')
    const id = $choice.data('option-id')
    const $name = $choice.find('.choice-name')
    const name = $name.val()
    const description = $choice.find('.choice-description').val()

    $.ajax({
      dataType: 'json',
      url: `/api/option/${id}`,
      method: 'patch',
      data: { poll, name, description }
    }).done(res => {
      const { errors } = res
      if (res.success) updateChoiceGroup(res.options)

      if (errors && errors.name) {
        const message = errMessage(errors.name, 'Name')

        $name.data('toggle', 'tooltip')
        $name.addClass('is-invalid')
        $name.tooltip('dispose')
        $name.tooltip({ title: message })
      }
    })
  })

  $choiceGroup.on('click', '.btn-add-choice', e => {
    const $choice = $(e.target).closest('.choice')
    const poll = $choiceGroup.data('poll-id')
    const $name = $choice.find('.choice-name')
    const name = $name.val()
    const description = $choice.find('.choice-description').val()

    $.ajax({
      dataType: 'json',
      url: `/api/option`,
      method: 'post',
      data: { poll, name, description }
    }).done(res => {
      const { errors } = res
      if (res.success) updateChoiceGroup(res.options)

      if (errors && errors.name) {
        const message = errMessage(errors.name, 'Name')

        $name.data('toggle', 'tooltip')
        $name.addClass('is-invalid')
        $name.tooltip('dispose')
        $name.tooltip({ title: message })
      }
    })
  })
}

/* global $ */
