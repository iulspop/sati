function PromptQueue() {
  let recurringQuestionList = []
  let answerList = []

  return {
    createRecurringQuestion: question => {
      recurringQuestionList = [...recurringQuestionList, question]
    },
    query: () =>
      recurringQuestionList
        .reduce((promptList, { id, question }) => [{ questionId: id, question }, ...promptList], [])
        .filter(prompt => !answerList.find(answer => answer.questionId === prompt.questionId)),
    answerPrompt: answer => {
      answerList = [...answerList, answer]
    },
    getAnswers: () => {
      return answerList
    },
  }
}

export { PromptQueue }
