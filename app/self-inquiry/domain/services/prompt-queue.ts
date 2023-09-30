import type { Answer } from '../entities/answer'
import type { RecurringQuestion } from '../entities/recurring-question'
import type { Prompt } from '../value-objects/prompt'
import type { AnswersAPI } from './answers'
import type { RecurringQuestionsAPI } from './recurring-questions'

export interface PromptQueueAPI {
  query: (userId: string, queryTimeLocal?: Date) => Promise<Prompt[]>
}

export const PromptQueueService =
  (recurringQuestionsService: RecurringQuestionsAPI) =>
  (answersService: AnswersAPI): PromptQueueAPI => ({
    query: async (userId, queryTimeLocal = toLocalTime({ timestamp: new Date(), utcOffsetInMinutes: new Date().getTimezoneOffset() })) => {
      const recurringQuestionList = await recurringQuestionsService.readAll(userId)
      const answerList = await answersService.readAll(userId)
      return calculateQuery(recurringQuestionList, answerList, queryTimeLocal)
    },
  })

type CalculateQuery = (recurringQuestionList: RecurringQuestion[], answerList: Answer[], queryTimeLocal: Date) => Prompt[]
export const calculateQuery: CalculateQuery = (recurringQuestionList, answerList, queryTimeLocal) =>
  pipe(
    calculatePromptList(recurringQuestionList),
    keepUnlessPromptAnswered(answerList),
    filterIfCurrentDay(queryTimeLocal),
    sortByDay
  )(queryTimeLocal)

type CalculatePromptList = (recurringQuestionList: RecurringQuestion[]) => (queryTimeLocal: Date) => Prompt[]
export const calculatePromptList: CalculatePromptList = recurringQuestionList => queryTimeLocal =>
  recurringQuestionList.reduce(
    (promptList: Prompt[], { id, text, timestamp, utcOffsetInMinutes }) => [
      ...promptList,
      ...toDayList(toUTCTime(toStartOfDay(toLocalTime({ timestamp, utcOffsetInMinutes })), utcOffsetInMinutes), queryTimeLocal).map(timestamp => ({
        questionId: id,
        text,
        timestamp,
      })),
    ],
    []
  )

type KeepUnlessPromptAnswered = (answerList: Answer[]) => (promptList: Prompt[]) => Prompt[]
export const keepUnlessPromptAnswered: KeepUnlessPromptAnswered = answerList => promptList =>
  promptList.filter(
    prompt => !answerList.some(answer => answer.questionId === prompt.questionId && answer.timestamp.toISOString() === prompt.timestamp.toISOString())
  )

type FilterIfCurrentDay = (queryTimeLocal: Date) => (promptList: Prompt[]) => Prompt[]
export const filterIfCurrentDay: FilterIfCurrentDay = queryTimeLocal => promptList =>
  promptList.filter(prompt => prompt.timestamp.toISOString().split('T')[0] != queryTimeLocal.toISOString().split('T')[0])

type SortByDay = (promptList: Prompt[]) => Prompt[]
export const sortByDay: SortByDay = promptList => [...promptList].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

const pipe =
  (...fns: Function[]) =>
  x =>
    fns.reduce((v, f) => f(v), x)

const addDays = (days: number) => (date: Date) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addDay = addDays(1)

export const toDayList = (startDate: Date, endDate: Date) => {
  const dayList = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    dayList.push(currentDate)
    currentDate = addDay(currentDate)
  }
  return dayList
}

export const toStartOfDay = (date: Date) => {
  const dateCopy = new Date(date)
  dateCopy.setUTCHours(0, 0, 0, 0)
  return dateCopy
}

type ToLocalTime = ({ timestamp, utcOffsetInMinutes }: { timestamp: Date; utcOffsetInMinutes: number }) => Date
export const toLocalTime: ToLocalTime = ({ timestamp, utcOffsetInMinutes }) => new Date(timestamp.getTime() - utcOffsetInMinutes * 60 * 1000)

type ToUTCTime = (timestamp: Date, utcOffsetInMinutes: number) => Date
const toUTCTime: ToUTCTime = (timestamp, utcOffsetInMinutes) => new Date(timestamp.getTime() + utcOffsetInMinutes * 60 * 1000)
