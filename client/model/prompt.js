function PromptQueue() {
  let recurringQuestionList = []
  let answerList = []

  return {
    createRecurringQuestion: question => {
      recurringQuestionList = [...recurringQuestionList, question]
    },
    query: currentDate =>
      recurringQuestionList
        .reduce(
          (promptList, { id, question, startDate }) => [
            ...toDayList(startDate, currentDate).map(date => ({ questionId: id, question, date })),
            ...promptList,
          ],
          []
        )
        .filter(prompt => !answerList.find(answer => answer.questionId === prompt.questionId)),
    answerPrompt: answer => {
      answerList = [...answerList, answer]
    },
    getAnswers: () => {
      return answerList
    },
  }
}

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
