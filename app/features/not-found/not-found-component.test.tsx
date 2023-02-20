import { afterEach, describe, expect, it } from 'vitest'

import { cleanup, createRemixStub, render, screen } from '~/test/test-utils'

import { NotFoundComponent } from './not-found-component'

// Something about I18nextProvider i18next being shared causes:
// Warning: An update to XComponent inside a test was not wrapped in act(...).
// explicit cleanup fixes it for some reason
afterEach(cleanup)

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
