import AnswerRepository from '../repositories/answerRepository'
import RecurringQuestionRepository from '../repositories/recurringQuestionRepository'

const PromptQueue =
  (recurringQuestionRepository: RecurringQuestionRepository) => (answerRepository: AnswerRepository) => ({
    createRecurringQuestion: async recurringQuestion => await recurringQuestionRepository.create(recurringQuestion),
    query: async currentDate => {
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

const calculatePromptList = recurringQuestionList => currentDate =>
  recurringQuestionList.reduce(
    (promptList, { id, question, startDate }) => [
      ...toDayList(startDate, currentDate).map(date => ({ questionId: id, question, timestamp: date })),
      ...promptList,
    ],
    []
  )

const keepUnlessPromptAnswered = answerList => promptList =>
  promptList.filter(
    prompt =>
      !answerList.find(
        answer =>
          answer.questionId === prompt.questionId && answer.timestamp.toDateString() === prompt.timestamp.toDateString()
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
