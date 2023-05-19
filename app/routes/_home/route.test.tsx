import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import HomePage from './route'

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
