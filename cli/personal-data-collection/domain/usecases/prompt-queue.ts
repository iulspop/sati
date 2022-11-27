import AnswerRepository from '../repositories/answer-repository.js'
import RecurringQuestionRepository from '../repositories/recurring-question-repository.js'
import Prompt from '../entities/prompt.js'
import RecurringQuestion from '../entities/recurring-question.js'
import Answer from '../entities/answer.js'

interface PromptQueueAPI {
  createRecurringQuestion: (recurringQuestion: Partial<RecurringQuestion>) => Promise<void>
  query: (queryTimeLocal?: Date) => Promise<Array<Prompt>>
  answerPrompt: (answer: Partial<Answer>) => Promise<void>
  getAnswers: () => Promise<Array<Answer>>
}

type a = (recurringQuestionRepository: RecurringQuestionRepository) => (answerRepository: AnswerRepository) => PromptQueueAPI
const PromptQueue: a = recurringQuestionRepository => answerRepository => ({
  createRecurringQuestion: async recurringQuestion => await recurringQuestionRepository.create(recurringQuestion),
  query: async (queryTimeLocal = toLocalTime({ timestamp: new Date(), utcOffsetInMinutes: new Date().getTimezoneOffset() })) => {
    const recurringQuestionList = await recurringQuestionRepository.findMany()
    const answerList = await answerRepository.findMany()
    return calculateQuery(recurringQuestionList, answerList, queryTimeLocal)
  },
  answerPrompt: async answer => {
    await answerRepository.create(answer)
  },
  getAnswers: async () => {
    return answerRepository.findMany()
  },
})

type b = (recurringQuestionList: RecurringQuestion[], answerList: Answer[], queryTimeLocal: Date) => Prompt[]
const calculateQuery: b = (recurringQuestionList, answerList, queryTimeLocal) =>
  pipe(
    calculatePromptList(recurringQuestionList),
    keepUnlessPromptAnswered(answerList),
    filterIfCurrentDay(queryTimeLocal)
  )(queryTimeLocal)

type c = (recurringQuestionList: Array<RecurringQuestion>) => (queryTimeLocal: Date) => Array<Prompt>
const calculatePromptList: c = recurringQuestionList => queryTimeLocal =>
  recurringQuestionList.reduce(
    (promptList, { id, question, phases }) => [
      ...promptList,
      ...toDayList(toStartOfDay(toLocalTime(phases[0])), queryTimeLocal).map(date => ({
        questionId: id,
        question,
        timestamp: date,
      })),
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

type e = (date: Date) => (promptList: Prompt[]) => Prompt[]
const filterIfCurrentDay: e = queryTimeLocal => promptList =>
  promptList.filter(prompt => prompt.timestamp.toDateString() != queryTimeLocal.toDateString())

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

type f = ({ timestamp, utcOffsetInMinutes }: { timestamp: Date; utcOffsetInMinutes: number }) => Date
const toLocalTime: f = ({ timestamp, utcOffsetInMinutes }) => new Date(timestamp.getTime() - utcOffsetInMinutes * 60 * 1000)

export { PromptQueue, toDayList, addDays, addDay, toStartOfDay, toLocalTime }
