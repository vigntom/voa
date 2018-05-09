const classnames = require('classnames')
const h = require('./hyperscript')
const { nav, ul, li, a, span } = h

function PaginationNavBar (options, nest) {
  const { paginate, pageCount } = options

  if (paginate.hasPreviousPages || paginate.hasNextPages(pageCount)) {
    return nav({ 'aria-label': options['aria-label'] }, nest)
  }
}

function StandardBar (options) {
  const { paginate, pageCount, pages } = options
  const className = classnames('paginate', options.className)

  return ul({ className }, [].concat(
    PaginationPrevious({ paginate, pageCount }),
    PaginationFirst({ paginate, pageCount }),
    PaginationBeforeGap({ pages, pageCount }),
    PaginationBar({ paginate, pages, pageCount }),
    PaginationAfterGap({ pages, pageCount }),
    PaginationLast({ paginate, pageCount }),
    PaginationNext({ paginate, pageCount })
  ))
}

function PaginationPrevious ({ paginate, pageCount }) {
  if (pageCount > 1) {
    const disabled = (paginate.page < 2) ? '.disabled' : ''

    return li(`.page-item${disabled}`, [
      a('.page-link', { href: paginate.href(true) }, 'Previous')
    ])
  }
}

function PaginationBar ({ paginate, pages, pageCount }) {
  if (pages.length > 3) {
    const active = x => (paginate.page === x) ? '.active' : ''

    return pages.map(({ number, url }) => {
      if (number === 1) { return }
      if (number === pageCount) { return }

      return li(`.page-item${active(number)}`, [
        a('.page-link', { href: url }, number)
      ])
    }
    )
  }
}

function PaginationNext ({ paginate, pageCount }) {
  if (pageCount > 1) {
    const disabled = paginate.hasNextPages(pageCount) ? '' : '.disabled'
    return li(`.page-item${disabled}`, [
      a('.page-link', { href: paginate.href() }, 'Next')
    ])
  }
}

function PaginationFirst ({ paginate, pageCount }) {
  if (pageCount > 0) {
    const active = paginate.page === 1 ? '.active' : ''

    return li(`.page-item${active}`, [
      a('.page-link', {
        href: paginate.href({ page: 1 })
      }, '1')
    ])
  }
}

function PaginationLast ({ paginate, pageCount }) {
  if (pageCount > 2) {
    const active = paginate.page === pageCount ? '.active' : ''

    return li(`.page-item${active}`, [
      a('.page-link', { href: paginate.href({ page: pageCount }) }, pageCount)
    ])
  }
}

function PaginationBeforeGap ({ pages, pageCount }) {
  if (pageCount > 3) {
    if (pages[0].number - 1 > 1) {
      return li('.page-item.disabled', [ span('.page-link', '...') ])
    }
  }
}

function PaginationAfterGap ({ pages, pageCount }) {
  if (pageCount > 3) {
    if (pageCount - pages[pages.length - 1].number > 1) {
      return li('.page-item.disabled', [ span('.page-link', '...') ])
    }
  }
}

function PaginationStdBar ({ pageCount, pages, paginate }) {
  return PaginationNavBar({
    'aria-label': 'Users index navigation',
    paginate,
    pageCount
  }, [ StandardBar({
    className: 'pt-4 pb-5 justify-content-center',
    paginate,
    pageCount,
    pages
  })])
}

module.exports = PaginationStdBar
