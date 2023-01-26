import { describe, test } from 'vitest'
import { render, screen } from '@testing-library/react'

const SLO = () => <div>SLO</div>

describe('<SLO>', () => {
  test('given SLO data: renders SLO', () => {
    render(<SLO />)
    expect(screen.getByText('SLO')).toBeInTheDocument()
  })
})
