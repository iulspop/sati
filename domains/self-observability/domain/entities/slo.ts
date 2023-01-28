import { createId } from '@paralleldrive/cuid2'

export interface SLO {
  id: string
  createdAt: Date
  name: string
  denominatorLabel: string
  denominator: number
  targetPercentage: number
  interpreter: string
}

export const createSLO = ({
  id = createId(),
  createdAt = new Date(),
  name = 'N/A',
  denominatorLabel = 'N/A',
  denominator = 1,
  targetPercentage = 100,
  interpreter = 'boolean',
}): SLO => ({
  id,
  createdAt,
  name,
  denominatorLabel,
  denominator,
  targetPercentage,
  interpreter,
})
