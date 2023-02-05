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

export const Monitor =
  (SLOs: SLOsAPI) =>
  (Streams: StreamsAPI): MonitorAPI => ({
    currentPercentage: pipeP(loadSLOandResults(SLOs)(Streams), toPromise(currentPercentage)),
    maxPossiblePercentage: pipeP(loadSLOandResults(SLOs)(Streams), toPromise(maxPossiblePercentage)),
    budget: pipeP(SLOs.read, toPromise(budget)),
    spentBudget: pipeP(loadEvents(Streams), toPromise(spentBudget)),
    remainingBudget: pipeP(
      loadSLOandResults(SLOs)(Streams),
      async ({ slo, results }) => ({ budget: budget(slo), spentBudget: spentBudget(results) }),
      toPromise(remainingBudget)
    ),
  })

const loadSLOandResults = (SLOs: SLOsAPI) => (Streams: StreamsAPI) =>
  R.pipeWith(R.andThen)([
    SLOs.read,
    async slo => ({ slo, stream: await Streams.findBySLOId(slo.id) }),
    async ({ slo, stream }) => ({ slo, results: interpret(await Streams.readEvents(stream.id)) }),
  ])

const loadEvents = (Streams: StreamsAPI) =>
  R.pipeWith(R.andThen)([Streams.findBySLOId, R.prop('id'), Streams.readEvents, toPromise(interpret)])

type PipeP = <TArgs extends any[], TResult>(
  ...fns: R.AtLeastOneFunctionsFlow<TArgs, TResult>
) => (...args: TArgs) => TResult
const pipeP: PipeP = (...fns) => R.pipeWith(R.andThen)(fns)

const toPromise =
  <TArg, TResult>(fn: (arg: TArg) => TResult) =>
  (arg: TArg): Promise<Awaited<TResult>> =>
    Promise.resolve(fn(arg))

type Results = boolean[]
type Interpret = (events: Event[]) => Results
export const interpret: Interpret = events => events.map(event => event.data.response)

type MaxPossiblePercentage = (_: { slo: Partial<SLO>; results: Results }) => number
export const maxPossiblePercentage: MaxPossiblePercentage = ({ slo: { denominator }, results }) =>
  toSecondDecimal((denominator - spentBudget(results)) / denominator)

type CurrentPercentage = (_: { slo: Partial<SLO>; results: Results }) => number
export const currentPercentage: CurrentPercentage = ({ slo: { denominator }, results }) =>
  toSecondDecimal(results.filter(result => result).length / denominator)

type Budget = (slo: { denominator: SLO['denominator']; targetPercentage: SLO['targetPercentage'] }) => number
export const budget: Budget = ({ targetPercentage, denominator }) => Math.floor((1 - targetPercentage) * denominator)

type SpentBudget = (results: Results) => number
export const spentBudget: SpentBudget = results => results.filter(result => !result).length

type RemainingBudget = (_: { budget: number; spentBudget: number }) => number
export const remainingBudget: RemainingBudget = ({ budget, spentBudget }) => budget - spentBudget

const toSecondDecimal = (num: number): number => Math.floor(num * 100) / 100
