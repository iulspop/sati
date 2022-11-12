import AnswerRepository from '../repositories/answer-repository'
import RecurringQuestionRepository from '../repositories/recurring-question-repository'
import Prompt from '../entities/prompt'
import RecurringQuestion from '../entities/recurring-question'
import Answer from '../entities/answer'
import PromptQueueAPI from './prompt-queue-api'

type a = (recurringQuestionRepository: RecurringQuestionRepository) => (answerRepository: AnswerRepository) => PromptQueueAPI
const PromptQueue: a = recurringQuestionRepository => answerRepository => ({
  createRecurringQuestion: async recurringQuestion => await recurringQuestionRepository.create(recurringQuestion),
  query: async (currentDate = new Date()) => {
    const recurringQuestionList = await recurringQuestionRepository.findMany()
    const answerList = await answerRepository.findMany()
    return pipe(calculatePromptList(recurringQuestionList), keepUnlessPromptAnswered(answerList))(currentDate)
  },
  answerPrompt: async answer => {
    await answerRepository.create(answer)
  },
  getAnswers: async () => {
    return answerRepository.findMany()
  },
})

type b = (recurringQuestionList: Array<RecurringQuestion>) => (currentDate: Date) => Array<Prompt>
const calculatePromptList: b = recurringQuestionList => currentDate =>
  recurringQuestionList.reduce(
    (promptList, { id, question, startDate }) => [
      ...toDayList(startDate, currentDate).map(date => ({ questionId: id, question, timestamp: date })),
      ...promptList,
    ],
    []
  )

type c = (answerList: Array<Answer>) => (promptList: Array<Prompt>) => Array<Prompt>
const keepUnlessPromptAnswered: c = answerList => promptList =>
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

export { PromptQueue, toDayList, addDays, addDay }
