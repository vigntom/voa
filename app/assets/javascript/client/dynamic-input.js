export default function () {
  const $choiceGroup = $('.choice-group')
  const $deleteOption = $('#delete-option')
  const $deleteModal = $('#delete-option-modal')
  const $deleteBtn = $('#delete-option-button')
  const $mainBody = $('.main-body')

  function errMessage (error, path) {
    if (error.kind === 'unique') {
      return `${path} must be unique`
    }

    return error.message
  }

  function updateChoiceGroup ({ content, flash }) {
    $choiceGroup.empty().append($(content))

    if (flash) {
      $mainBody.append($(flash))

      $('.alert-fadable').delay(3000).fadeTo(1000, 0.5, () => {
        $('.alert-fadable').alert('close')
      })
    }
  }

  $deleteModal.on('show.bs.modal', e => {
    const $btn = $(e.relatedTarget)
    const id = $btn.closest('.choice').find('[name=id]').val()
    $deleteOption.find('[name=id]').val(id)
  })

  $deleteOption.on('submit', e => {
    const id = $deleteOption.find('[name=id]').val()
    const data = { poll: $choiceGroup.data('poll-id') }

    e.preventDefault()

    $.ajax({
      dataType: 'json',
      url: `/api/option/${id}`,
      method: 'delete',
      data
    }).done(res => {
      if (res.success) updateChoiceGroup(res)
    }).always(() => {
      $deleteModal.modal('toggle')
    })
  })

  $choiceGroup.on('submit', '.update-option', e => {
    const $choice = $(e.target).closest('.choice')
    const poll = $choiceGroup.data('poll-id')
    const id = $choice.find('[name=id]').val()
    const $name = $choice.find('[name=name]')
    const name = $name.val()
    const description = $choice.find('[name=description]').val()

    e.preventDefault()

    $.ajax({
      dataType: 'json',
      url: `/api/option/${id}`,
      method: 'patch',
      data: { poll, name, description }
    }).done(res => {
      const { errors } = res
      if (res.success) updateChoiceGroup(res)

      if (errors && errors.name) {
        const message = errMessage(errors.name, 'Name')

        $name.data('toggle', 'tooltip')
        $name.addClass('is-invalid')
        $name.tooltip('dispose')
        $name.tooltip({ title: message })
      }
    })
  })

  $choiceGroup.on('submit', '.add-option', e => {
    const $choice = $(e.target).closest('.choice')
    const poll = $choiceGroup.data('poll-id')
    const $name = $choice.find('[name=name]')
    const name = $name.val()
    const description = $choice.find('[name=description]').val()

    e.preventDefault()

    $.ajax({
      dataType: 'json',
      url: `/api/option`,
      method: 'post',
      data: { poll, name, description }
    }).done(res => {
      const { errors } = res
      if (res.success) updateChoiceGroup(res)

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
