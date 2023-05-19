import { describe, expect, test } from 'vitest'
import { calculateIfLinkIsCurrent } from './home-page-component'

describe('calculateIfLinkIsCurrent()', () => {
  test('given an equal path and href: returns true', () => {
    expect(calculateIfLinkIsCurrent({ path: '/queue', href: '/queue' })).toEqual(true)
  })

  test('given an unequal path and href: returns false', () => {
    expect(calculateIfLinkIsCurrent({ path: '/queue', href: '/' })).toEqual(false)
  })

  test('given an href is a subpath of the path: returns true', () => {
    expect(calculateIfLinkIsCurrent({ path: '/questions', href: '/questions/123' })).toEqual(true)
  })

  test('given an href that is not a subpath of the path: returns false', () => {
    expect(calculateIfLinkIsCurrent({ path: '/questions', href: '/question' })).toEqual(false)
    expect(calculateIfLinkIsCurrent({ path: '/questions', href: '/questions123' })).toEqual(false)
  })
})
