import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import HomePage, { calculateIfLinkIsCurrent } from './route'

describe('Home page', () => {
  test("given initial load: render the navigation bar with links to 'Recurring Questions' and 'Prompt Queue'", async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <HomePage />,
      },
    ])

    render(<RemixStub />)

    const navigation = screen.getByRole('navigation')
    expect(within(navigation).getByText('Recurring Questions')).toHaveAttribute('href', '/questions')
    expect(within(navigation).getByText('Prompt Queue')).toHaveAttribute('href', '/queue')
  })

  test('given initial load with path matching link href: render the link as activated', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/queue',
        element: <HomePage />,
      },
    ])

    render(<RemixStub initialEntries={['/queue']} />)

    const navigation = screen.getByRole('navigation')
    expect(within(navigation).getByText('Recurring Questions')).not.toHaveAttribute('aria-current')
    expect(within(navigation).getByText('Prompt Queue')).toHaveAttribute('aria-current', 'page')
  })
})

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
