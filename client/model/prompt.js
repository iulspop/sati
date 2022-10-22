function PromptQueue() {
  let questionList = []
  let answerList = []

  return {
    createQuestion: question => {
      questionList = [...questionList, question]
    },
    query: () =>
      questionList
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
