import { createId } from '@paralleldrive/cuid2'

export interface SLO {
  id: string
  createdAt: Date
  name: string
  denominatorLabel: string
  denominator: number
  targetPercentage: number
}

export const sloFactory = ({
  id = createId(),
  createdAt = new Date(),
  name = 'N/A',
  denominatorLabel = 'N/A',
  denominator = 1,
  targetPercentage = 100,
}): SLO => ({
  id,
  createdAt,
  name,
  denominatorLabel,
  denominator,
  targetPercentage,
})
