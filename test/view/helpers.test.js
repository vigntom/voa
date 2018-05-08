import test from 'ava'
import w from '../../app/view/helpers'

test('Should not create path without author', t => {
  const f = () => w.path({ pollname: 'foobar' })

  t.throws(f, "Can't create path without author")
})

test('Should create path with author', t => {
  const path = w.path({ author: 'foo' })
  t.is(path, '/ui/foo')
})

test('Should create path with author and poll', t => {
  const path = w.path({ author: 'foo', pollname: 'bar' })
  t.is(path, '/ui/foo/bar')
})

test('Should create path with author, poll and rest', t => {
  const path = w.path({ author: 'foo', pollname: 'bar', rest: 'gaz' })
  t.is(path, '/ui/foo/bar/gaz')
})
