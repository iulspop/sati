import AnswerRepository from '../repositories/answer-repository.js'
import RecurringQuestionRepository from '../repositories/recurring-question-repository.js'
import Prompt from '../entities/prompt.js'
import RecurringQuestion from '../entities/recurring-question.js'
import Answer from '../entities/answer.js'

interface PromptQueueAPI {
  createRecurringQuestion: (recurringQuestion: Partial<RecurringQuestion>) => Promise<void>
  query: (queryTime?: Date) => Promise<Array<Prompt>>
  answerPrompt: (answer: Partial<Answer>) => Promise<void>
  getAnswers: () => Promise<Array<Answer>>
}

type a = (recurringQuestionRepository: RecurringQuestionRepository) => (answerRepository: AnswerRepository) => PromptQueueAPI
const PromptQueue: a = recurringQuestionRepository => answerRepository => ({
  createRecurringQuestion: async recurringQuestion => await recurringQuestionRepository.create(recurringQuestion),
  query: async (queryTime = new Date()) => {
    const recurringQuestionList = await recurringQuestionRepository.findMany()
    const answerList = await answerRepository.findMany()
    return calculateQuery(recurringQuestionList, answerList, queryTime)
  },
  answerPrompt: async answer => {
    await answerRepository.create(answer)
  },
  getAnswers: async () => {
    return answerRepository.findMany()
  },
})

type b = (recurringQuestionList: RecurringQuestion[], answerList: Answer[], queryTime: Date) => Prompt[]
const calculateQuery: b = (recurringQuestionList, answerList, queryTime) =>
  pipe(calculatePromptList(recurringQuestionList), keepUnlessPromptAnswered(answerList))(queryTime)

type c = (recurringQuestionList: Array<RecurringQuestion>) => (queryTime: Date) => Array<Prompt>
const calculatePromptList: c = recurringQuestionList => queryTime =>
  recurringQuestionList.reduce(
    (promptList, { id, question, phases }) => [
      ...toDayList(phases[0].timestamp, queryTime).map(date => ({ questionId: id, question, timestamp: date })),
      ...promptList,
    ],
    []
  )

type d = (answerList: Array<Answer>) => (promptList: Array<Prompt>) => Array<Prompt>
const keepUnlessPromptAnswered: d = answerList => promptList =>
  promptList.filter(
    prompt =>
      !answerList.find(
        answer => answer.questionId === prompt.questionId && answer.timestamp.toDateString() === prompt.timestamp.toDateString()
      )
  )

const pipe =
  (...fns) =>
  x =>
    fns.reduce((v, f) => f(v), x)

const addDays = days => date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const addDay = addDays(1)

const toDayList = (startDate, endDate) => {
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
  dateCopy.setUTCHours(0, 0)
  return dateCopy
}

type e = ({ timestamp, utcOffsetInMinutes }: { timestamp: Date; utcOffsetInMinutes: number }) => Date
const toLocalTime: e = ({ timestamp, utcOffsetInMinutes }) => new Date(timestamp.getTime() - utcOffsetInMinutes * 60 * 1000)

export { PromptQueue, toDayList, addDays, addDay, toStartOfDay, toLocalTime }
