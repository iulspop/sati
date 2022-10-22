function QuestionQueue() {
  let questionList = []
  let answerList = []

  return {
    createQuestion: question => {
      questionList = [...questionList, question]
    },
    query: () =>
      questionList.reduce((promptList, { id, question }) => [{ questionId: id, question }, ...promptList], []),
    answerPrompt: answer => {
      answerList = [...answerList, answer]
    },
    getAnswers: () => {
      return answerList
    },
  }
}

export { QuestionQueue }
