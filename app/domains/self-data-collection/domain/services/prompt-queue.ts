import { Answer, answerFactory } from '../entities/answer'
import { RecurringQuestion, recurringQuestionFactory } from '../entities/recurring-question'
import { AnswerRepositoryAPI } from '../repositories/answer-repository'
import { RecurringQuestionRepositoryAPI } from '../repositories/recurring-question-repository'
import { Prompt } from '../value-objects/prompt'

export interface PromptQueueAPI {
  getAnswers: () => Promise<Answer[]>
  createAnswer: (answer: Partial<Answer>) => Promise<void>
  getRecurringQuestions: () => Promise<RecurringQuestion[]>
  createRecurringQuestion: (recurringQuestion: Partial<RecurringQuestion>) => Promise<void>
  query: (queryTimeLocal?: Date) => Promise<Prompt[]>
}

export const PromptQueue =
  (recurringQuestionRepository: RecurringQuestionRepositoryAPI) =>
  (answerRepository: AnswerRepositoryAPI): PromptQueueAPI => ({
    createAnswer: partialAnswer => answerRepository.create(answerFactory(partialAnswer)),
    getAnswers: answerRepository.findMany,
    createRecurringQuestion: async partialRecurringQuestion => {
      if ('order' in partialRecurringQuestion)
        return await recurringQuestionRepository.create(recurringQuestionFactory(partialRecurringQuestion))

      const recurringQuestions = await recurringQuestionRepository.findMany()
      const lastOrder = recurringQuestions.reduce(
        (max, recurringQuestion) => Math.max(max, recurringQuestion.order),
        -1
      )

      await recurringQuestionRepository.create(
        recurringQuestionFactory({ ...partialRecurringQuestion, order: lastOrder + 1 })
      )
    },
    getRecurringQuestions: recurringQuestionRepository.findMany,
    query: async (
      queryTimeLocal = toLocalTime({ timestamp: new Date(), utcOffsetInMinutes: new Date().getTimezoneOffset() })
    ) => {
      const recurringQuestionList = await recurringQuestionRepository.findMany()
      const answerList = await answerRepository.findMany()
      return calculateQuery(recurringQuestionList, answerList, queryTimeLocal)
    },
  })

type CalculateQuery = (
  recurringQuestionList: RecurringQuestion[],
  answerList: Answer[],
  queryTimeLocal: Date
) => Prompt[]
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
    (promptList: Prompt[], { id, question, phase }) => [
      ...promptList,
      ...toDayList(toUTCTime(toStartOfDay(toLocalTime(phase)), phase.utcOffsetInMinutes), queryTimeLocal).map(date => ({
        questionId: id,
        question,
        timestamp: date,
      })),
    ],
    []
  )

type KeepUnlessPromptAnswered = (answerList: Answer[]) => (promptList: Prompt[]) => Prompt[]
export const keepUnlessPromptAnswered: KeepUnlessPromptAnswered = answerList => promptList =>
  promptList.filter(
    prompt =>
      !answerList.find(
        answer =>
          answer.questionId === prompt.questionId && answer.timestamp.toISOString() === prompt.timestamp.toISOString()
      )
  )

type FilterIfCurrentDay = (queryTimeLocal: Date) => (promptList: Prompt[]) => Prompt[]
export const filterIfCurrentDay: FilterIfCurrentDay = queryTimeLocal => promptList =>
  promptList.filter(
    prompt => prompt.timestamp.toISOString().split('T')[0] != queryTimeLocal.toISOString().split('T')[0]
  )

type SortByDay = (promptList: Prompt[]) => Prompt[]
export const sortByDay: SortByDay = promptList =>
  [...promptList].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

const pipe =
  (...fns: Function[]) =>
  // @ts-ignore
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
export const toLocalTime: ToLocalTime = ({ timestamp, utcOffsetInMinutes }) =>
  new Date(timestamp.getTime() - utcOffsetInMinutes * 60 * 1000)

type ToUTCTime = (timestamp: Date, utcOffsetInMinutes: number) => Date
const toUTCTime: ToUTCTime = (timestamp, utcOffsetInMinutes) =>
  new Date(timestamp.getTime() + utcOffsetInMinutes * 60 * 1000)
