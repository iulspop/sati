function PromptQueue() {
  let recurringQuestionList = []
  let answerList = []

  return {
    createRecurringQuestion: question => {
      recurringQuestionList = [...recurringQuestionList, question]
    },

    //Takes the date argument and
    query: currentDate =>
      pipe(createPromptList(recurringQuestionList), filterUnansweredPrompts(answerList))(currentDate),
    // currentDate is passed to the function returned by createPromptList;
    // the return value of the function call is then passed to the function returned by filterUnansweredPrompts.
    //Everything makes sense now :).
    answerPrompt: answer => {
      answerList = [...answerList, answer]
    },
    getAnswers: () => {
      return answerList
    },
  }
}

const createPromptList = recurringQuestionList => currentDate =>
  recurringQuestionList.reduce(
    (promptList, { id, question, startDate }) => [
      ...toDayList(startDate, currentDate).map(date => ({ questionId: id, question, date })),
      ...promptList,
      //toDayList returns a list of date objects between the question's startDate and the currentDate.
      //The array of date objects is mapped to an array of 'prompt' objects with the properties:
      //questionId, question, date.
    ],
    []
  )

const filterUnansweredPrompts = answerList => promptList =>
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
// ex: pipe(add5, substract3)(2);
// the function add5 is called with 2 as its argument;
// the result is 7
// the function substract3 is called with the new value 7;
// the result is 4.

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
