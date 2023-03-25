import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NotFoundComponent } from './not-found-component'

describe('NotFound component', () => {
  it('given a link: renders error messages and the correct link', async () => {
    const path = '/some-non-existent-page'
    const RemixStub = createRemixStub([{ path, element: <NotFoundComponent /> }])

    render(<RemixStub initialEntries={[path]} />)

    expect(screen.getByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /inquire/i })).toHaveAttribute('href', '/')
  })
})
