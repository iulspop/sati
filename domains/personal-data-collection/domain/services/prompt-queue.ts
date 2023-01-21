import AnswerRepository from '../repositories/answer-repository.js'
import RecurringQuestionRepository from '../repositories/recurring-question-repository.js'
import Prompt from '../value-objects/prompt.js'
import RecurringQuestion, { createRecurringQuestion } from '../entities/recurring-question.js'
import Answer, { createAnswer } from '../entities/answer.js'

interface PromptQueueAPI {
  getAnswers: () => Promise<Answer[]>
  createAnswer: (answer: Partial<Answer>) => Promise<void>
  getRecurringQuestions: () => Promise<RecurringQuestion[]>
  createRecurringQuestion: (recurringQuestion: Partial<RecurringQuestion>) => Promise<void>
  query: (queryTimeLocal?: Date) => Promise<Prompt[]>
}

const PromptQueue =
  (recurringQuestionRepository: RecurringQuestionRepository) =>
  (answerRepository: AnswerRepository): PromptQueueAPI => ({
    createAnswer: partialAnswer => answerRepository.create(createAnswer(partialAnswer)),
    getAnswers: answerRepository.findMany,
    createRecurringQuestion: async partialRecurringQuestion => {
      if ('order' in partialRecurringQuestion)
        return recurringQuestionRepository.create(createRecurringQuestion(partialRecurringQuestion))

      const recurringQuestions = await recurringQuestionRepository.findMany()
      const lastOrder = recurringQuestions.reduce((max, recurringQuestion) => Math.max(max, recurringQuestion.order), 0)

      return recurringQuestionRepository.create(
        createRecurringQuestion({ ...partialRecurringQuestion, order: lastOrder + 1 })
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
const calculateQuery: CalculateQuery = (recurringQuestionList, answerList, queryTimeLocal) =>
  pipe(
    calculatePromptList(recurringQuestionList),
    keepUnlessPromptAnswered(answerList),
    filterIfCurrentDay(queryTimeLocal)
  )(queryTimeLocal)

type CalculatePromptList = (recurringQuestionList: RecurringQuestion[]) => (queryTimeLocal: Date) => Prompt[]
const calculatePromptList: CalculatePromptList = recurringQuestionList => queryTimeLocal =>
  recurringQuestionList.reduce(
    (promptList: Prompt[], { id, question, phases }) => [
      ...promptList,
      ...toDayList(toUTCTime(toStartOfDay(toLocalTime(phases[0])), phases[0].utcOffsetInMinutes), queryTimeLocal).map(
        date => ({
          questionId: id,
          question,
          timestamp: date,
        })
      ),
    ],
    []
  )

type KeepUnlessPromptAnswered = (answerList: Answer[]) => (promptList: Prompt[]) => Prompt[]
const keepUnlessPromptAnswered: KeepUnlessPromptAnswered = answerList => promptList =>
  promptList.filter(
    prompt =>
      !answerList.find(
        answer =>
          answer.questionId === prompt.questionId && answer.timestamp.toISOString() === prompt.timestamp.toISOString()
      )
  )

type FilterIfCurrentDay = (queryTimeLocal: Date) => (promptList: Prompt[]) => Prompt[]
const filterIfCurrentDay: FilterIfCurrentDay = queryTimeLocal => promptList =>
  promptList.filter(
    prompt => prompt.timestamp.toISOString().split('T')[0] != queryTimeLocal.toISOString().split('T')[0]
  )

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

const addDay = addDays(1)

const toDayList = (startDate: Date, endDate: Date) => {
  const dayList = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    dayList.push(currentDate)
    currentDate = addDay(currentDate)
  }
  return dayList
}

const toStartOfDay = (date: Date) => {
  const dateCopy = new Date(date)
  dateCopy.setUTCHours(0, 0, 0, 0)
  return dateCopy
}

type ToLocalTime = ({ timestamp, utcOffsetInMinutes }: { timestamp: Date; utcOffsetInMinutes: number }) => Date
const toLocalTime: ToLocalTime = ({ timestamp, utcOffsetInMinutes }) =>
  new Date(timestamp.getTime() - utcOffsetInMinutes * 60 * 1000)

type ToUTCTime = (timestamp: Date, utcOffsetInMinutes: number) => Date
const toUTCTime: ToUTCTime = (timestamp, utcOffsetInMinutes) =>
  new Date(timestamp.getTime() + utcOffsetInMinutes * 60 * 1000)

export {
  PromptQueue,
  toDayList,
  calculateQuery,
  keepUnlessPromptAnswered,
  filterIfCurrentDay,
  addDays,
  addDay,
  toStartOfDay,
  toLocalTime,
}
