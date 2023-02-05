import { prop } from 'ramda'
import { asyncPipe } from '~/utils/async-pipe'
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
    currentPercentage: asyncPipe(loadSLOandResults(SLOs, Streams), currentPercentage),
    maxPossiblePercentage: asyncPipe(loadSLOandResults(SLOs, Streams), maxPossiblePercentage),
    budget: asyncPipe(SLOs.read, budget),
    spentBudget: asyncPipe(loadEvents(Streams), spentBudget),
    remainingBudget: asyncPipe(loadSLOandResults(SLOs, Streams), remainingBudget),
  })

const loadSLOandResults = (SLOs: SLOsAPI, Streams: StreamsAPI) =>
  asyncPipe(
    SLOs.read,
    async slo => ({ slo, stream: await Streams.findBySLOId(slo.id) }),
    async ({ slo, stream }) => ({ slo, results: interpret(await Streams.readEvents(stream.id)) })
  )

const loadEvents = (Streams: StreamsAPI) => asyncPipe(Streams.findBySLOId, prop('id'), Streams.readEvents, interpret)

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

type RemainingBudget = (_: {
  slo: { denominator: SLO['denominator']; targetPercentage: SLO['targetPercentage'] }
  results: Results
}) => number
export const remainingBudget: RemainingBudget = ({ slo, results }) => budget(slo) - spentBudget(results)

const toSecondDecimal = (num: number): number => Math.floor(num * 100) / 100
