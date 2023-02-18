import { render, screen } from '@testing-library/react'
import { describe, test } from 'vitest'

import type { SLOProps } from './slo';
import { SLO } from './slo'

describe.skip('SLO component', () => {
  test('given SLO data: renders SLO', () => {
    const slo: SLOProps = {
      label: 'Days',
      targetPrecentage: 90,
      remainingMaxPercentage: 96.44,
      missBudget: 36,
      spentBudget: 13,
      remainingBudget: 23,
    }

    render(<SLO {...slo} />)
    expect(screen.getByText(slo.label, { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Target', { exact: false })).toHaveTextContent(String(slo.targetPrecentage))
    expect(screen.getByText('Max Possible', { exact: false })).toHaveTextContent(String(slo.remainingMaxPercentage))
    expect(screen.getByText('Misses Budget', { exact: false })).toHaveTextContent(String(slo.missBudget))
    expect(screen.getByText('Misses:', { exact: false })).toHaveTextContent(String(slo.spentBudget))
    expect(screen.getByText('Remaining', { exact: false })).toHaveTextContent(String(slo.remainingBudget))
  })
})
