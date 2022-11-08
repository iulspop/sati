function PromptQueue() {
  let recurringQuestionList = []
  let answerList = []

  return {
    createRecurringQuestion: question => {
      recurringQuestionList = [...recurringQuestionList, question]
    },
    query: currentDate =>
      pipe(calculatePromptList(recurringQuestionList), keepUnlessPromptAnswered(answerList))(currentDate),
    answerPrompt: answer => {
      answerList = [...answerList, answer]
    },
    getAnswers: () => {
      return answerList
    },
  }
}

const calculatePromptList = recurringQuestionList => currentDate =>
  recurringQuestionList.reduce(
    (promptList, { id, question, startDate }) => [
      ...toDayList(startDate, currentDate).map(date => ({ questionId: id, question, date })),
      ...promptList,
    ],
    []
  )

const keepUnlessPromptAnswered = answerList => promptList =>
  promptList.filter(
    prompt =>
      !answerList.find(
        answer => answer.questionId === prompt.questionId && answer.date.toDateString() === prompt.date.toDateString()
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
