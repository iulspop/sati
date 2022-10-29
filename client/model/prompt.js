function PromptQueue() {
  let recurringQuestionList = []
  let answerList = []

  return {
    createRecurringQuestion: question => {
      recurringQuestionList = [...recurringQuestionList, question]
    },
    query: currentDate =>
      recurringQuestionList
        .reduce((promptList, recurringQuestion) => [{ questionId: id, question }, ...promptList], [])
        .filter(prompt => !answerList.find(answer => answer.questionId === prompt.questionId)),
    answerPrompt: answer => {
      answerList = [...answerList, answer]
    },
    getAnswers: () => {
      return answerList
    },
  };
}

const addDays = days => date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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

/*

for each recurring question,
  create a prompt for each day since the start date, to the current date
   
filter out prompts that have already been answered for a date and a question


function toDayList(startDate, endDate) => array of dates


toDayList(recurringQuestion.startDate, currentDate).map

*/