import * as R from 'ramda'
import { Event } from '../entities/event'
import { SLO } from '../entities/slo'
import { SLOsAPI } from './slos'
import { StreamsAPI } from './streams'

interface MonitorAPI {
  currentPercentage: (sloId: string) => Promise<number>
  maxPossiblePercentage: (sloId: string) => Promise<number>
  budget: (sloId: string) => Promise<number>
  spentBudget: (sloId: string) => Promise<number>
  remainingBudget: (sloId: string) => Promise<number>
}

const loadSLOandResults = (SLOs: SLOsAPI) => (Streams: StreamsAPI) =>
  R.pipeWith(R.andThen)([
    async sloId => ({ sloId, slo: await SLOs.read(sloId) }),
    async ({ sloId, slo }) => ({ slo, stream: await Streams.findBySLOId(sloId) }),
    async ({ slo, stream }) => ({ slo, results: interpret(await Streams.readEvents(stream.id)) }),
  ])

export const Monitor =
  (SLOs: SLOsAPI) =>
  (Streams: StreamsAPI): MonitorAPI => ({
    currentPercentage: R.pipeWith(R.andThen)([
      loadSLOandResults(SLOs)(Streams),
      async ({ slo, results }) => currentPercentage(slo.denominator)(results),
    ]),
    maxPossiblePercentage: R.pipeWith(R.andThen)([
      loadSLOandResults(SLOs)(Streams),
      async ({ slo, results }) => maxPossiblePercentage(slo.denominator)(results),
    ]),
    budget: R.pipeWith(R.andThen)([
      SLOs.read,
      async ({ denominator, targetPercentage }) => budget(denominator)(targetPercentage),
    ]),
    spentBudget: R.pipeWith(R.andThen)([
      Streams.findBySLOId,
      async ({ id }) => id,
      Streams.readEvents,
      async events => interpret(events),
      async results => spentBudget(results),
    ]),
    remainingBudget: R.pipeWith(R.andThen)([
      loadSLOandResults(SLOs)(Streams),
      async ({ slo, results }) => remainingBudget(budget(slo.denominator)(slo.targetPercentage))(spentBudget(results)),
    ]),
  })

type Results = boolean[]
type Interpret = (events: Event[]) => Results
export const interpret: Interpret = events => events.map(event => event.data.response)

type MaxPossiblePercentage = (denominator: SLO['denominator']) => (results: Results) => number
export const maxPossiblePercentage: MaxPossiblePercentage = denominator => results =>
  toSecondDecimal((denominator - spentBudget(results)) / denominator)

type CurrentPercentage = (denominator: SLO['denominator']) => (results: Results) => number
export const currentPercentage: CurrentPercentage = denominator => results =>
  toSecondDecimal(results.filter(result => result).length / denominator)

type Budget = (denominator: SLO['denominator']) => (targetPercentage: SLO['targetPercentage']) => number
export const budget: Budget = denominator => targetPercentage => Math.floor((1 - targetPercentage) * denominator)

type SpentBudget = (results: Results) => number
export const spentBudget: SpentBudget = results => results.filter(result => !result).length

type RemainingBudget = (budget: number) => (spentBudget: number) => number
export const remainingBudget: RemainingBudget = budget => spentBudget => budget - spentBudget

const toSecondDecimal = (num: number): number => Math.floor(num * 100) / 100
