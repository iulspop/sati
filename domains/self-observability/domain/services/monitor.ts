import { Event } from '../entities/event'
import { SLO } from '../entities/slo'
import { SLOsAPI } from './slos'
import { StreamsAPI } from './streams'

interface MonitorAPI {
  maxPossiblePercentage: (sloId: number) => Promise<number>
  currentPercentage: (sloId: number) => Promise<number>
  budget: (sloId: number) => Promise<number>
  spentBudget: (sloId: number) => Promise<number>
  remainingBudget: (sloId: number) => Promise<number>
}

export const Monitor =
  (SLOs: SLOsAPI) =>
  (Streams: StreamsAPI): MonitorAPI => ({
    maxPossiblePercentage: async sloId => 1,
    currentPercentage: async sloId => 1,
    budget: async sloId => 1,
    spentBudget: async sloId => 1,
    remainingBudget: async sloId => 1,
  })

type Results = boolean[]
type Interpret = (events: Event[]) => Results
export const interpret: Interpret = events => events.map(event => event.data.response)

type MaxPossiblePercentage = (denominator: SLO['denominator']) => (results: Results) => number
export const maxPossiblePercentage: MaxPossiblePercentage = denominator => results =>
  (denominator - results.filter(result => !result).length) / denominator

type CurrentPercentage = (denominator: SLO['denominator']) => (results: Results) => number
export const currentPercentage: CurrentPercentage = denominator => results =>
  results.filter(result => result).length / denominator

type Budget = (denominator: SLO['denominator']) => (targetPercentage: SLO['targetPercentage']) => number
export const budget: Budget = denominator => targetPercentage => Math.floor((1 - targetPercentage) * denominator)

type SpentBudget = (results: Results) => number
export const spentBudget: SpentBudget = results => results.filter(result => !result).length

type RemainingBudget = (budget: number) => (spentBudget: number) => number
export const remainingBudget: RemainingBudget = budget => spentBudget => budget - spentBudget
