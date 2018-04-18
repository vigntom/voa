const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const dateFormat = require('dateformat')

const { div, ul, li, h4, a, p, time, span } = hh(h)

function PollsList ({ polls }) {
  return ul('.list-simple',
    polls.map(x => li([
      h4([a({ href: `/polls/${x._id}` }, `${x.author.username}/${x.name}`)]),
      p(x.description),
      p([span('.oi.oi-star'), ` ${x.stargazers.count}`]),
      p('.small', ['Updated on ', time(dateFormat(x.updatedAt, 'mediumDate'))])
    ]))
  )
}

function Dropdown ({ path }) {
  return div('.dropdown-menu.dropdown-menu-right', { 'aria-labelledby': 'dropdownMenuButton' }, [
    a('.dropdown-item', { href: `${path}?s=&o=desc` }, 'Best match'),
    a('.dropdown-item', { href: `${path}?s=stars&o=desc` }, 'Most stars'),
    a('.dropdown-item', { href: `${path}?s=stars&o=asc` }, 'Fewest stars'),
    a('.dropdown-item', { href: `${path}?s=updated&o=desc` }, 'Recently updated'),
    a('.dropdown-item', { href: `${path}?s=updated&o=asc` }, 'Least recently updated')
  ])
}

module.exports = function Index (options) {
  const info = `Result: ${options.pollsCount} polls`
  const path = '/polls'
  const menuItem = options.menuItem

  return div('.main.container.mt-3', [
    div('.row.justify-content-center', [
      div('.col-3', [ w.SortGroup(options) ]),
      div('.col-7', [ w.InfoBar({ info, menuItem }, Dropdown({ path })), PollsList(options) ])
    ]),
    w.PaginationStdBar(options)
  ])
}
