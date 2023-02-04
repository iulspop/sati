import { Event } from '../entities/event'
import { SLO } from '../entities/slo'
import { SLOsAPI } from './slos'
import { StreamsAPI } from './streams'

interface MonitorAPI {
  maxPossiblePercentage: (sloId: string) => Promise<number>
  currentPercentage: (sloId: string) => Promise<number>
  budget: (sloId: string) => Promise<number>
  spentBudget: (sloId: string) => Promise<number>
  remainingBudget: (sloId: string) => Promise<number>
}

export const Monitor =
  (SLOs: SLOsAPI) =>
  (Streams: StreamsAPI): MonitorAPI => ({
    maxPossiblePercentage: async sloId => {
      // @ts-ignore
      const slo: SLO = await SLOs.read(sloId)
      const stream = await Streams.findBySLOId(sloId)
      if (!stream) return 0
      const events = await Streams.readEvents(stream.id)
      return maxPossiblePercentage(slo.denominator)(interpret(events))
    },
    currentPercentage: async sloId => {
      // @ts-ignore
      const slo: SLO = await SLOs.read(sloId)
      const stream = await Streams.findBySLOId(sloId)
      if (!stream) return 0
      const events = await Streams.readEvents(stream.id)
      return currentPercentage(slo.denominator)(interpret(events))
    },
    budget: async sloId => {
      // @ts-ignore
      const slo: SLO = await SLOs.read(sloId)
      return budget(slo.denominator)(slo.targetPercentage)
    },
    spentBudget: async sloId => {
      const stream = await Streams.findBySLOId(sloId)
      if (!stream) return 0
      const events = await Streams.readEvents(stream.id)
      return spentBudget(interpret(events))
    },
    remainingBudget: async sloId => {
      // @ts-ignore
      const slo: SLO = await SLOs.read(sloId)
      const stream = await Streams.findBySLOId(sloId)
      if (!stream) return 0
      const events = await Streams.readEvents(stream.id)
      return remainingBudget(budget(slo.denominator)(slo.targetPercentage))(spentBudget(interpret(events)))
    },
  })

type Results = boolean[]
type Interpret = (events: Event[]) => Results
export const interpret: Interpret = events => events.map(event => event.data.response)

type MaxPossiblePercentage = (denominator: SLO['denominator']) => (results: Results) => number
export const maxPossiblePercentage: MaxPossiblePercentage = denominator => results =>
  (denominator - spentBudget(results)) / denominator

type CurrentPercentage = (denominator: SLO['denominator']) => (results: Results) => number
export const currentPercentage: CurrentPercentage = denominator => results =>
  results.filter(result => result).length / denominator

type Budget = (denominator: SLO['denominator']) => (targetPercentage: SLO['targetPercentage']) => number
export const budget: Budget = denominator => targetPercentage => Math.floor((1 - targetPercentage) * denominator)

type SpentBudget = (results: Results) => number
export const spentBudget: SpentBudget = results => results.filter(result => !result).length

type RemainingBudget = (budget: number) => (spentBudget: number) => number
export const remainingBudget: RemainingBudget = budget => spentBudget => budget - spentBudget
