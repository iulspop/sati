function QuestionQueue() {
  const questionList = []
  const answerList = []

  return {
    createQuestion: question => {
      questionList.push(question)
    },
    query: () =>
      questionList.reduce((promptList, { id, question }) => [{ questionId: id, question }, ...promptList], []),
    answerPrompt: answer => {
      answerList.push(answer)
    },
    getAnswers: () => {
      return answerList
    },
  }
}

export { QuestionQueue }
