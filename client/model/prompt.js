function QuestionQueue() {
  const questionList = []
  const answerList = []

  return {
    createQuestion: question => {
      questionList.push(question)
    },
    query: () =>
      questionList.reduce((promptList, { id, question }) => [{ questionId: id, question }, ...promptList], []),
    answerQuestion: answer => {
      answerList.push(answer)
    },
    getAnswers: () => {
      return answerList
    },
  }
}

/*
  query(date) => list of prompts

  algo:
    - init prompt list
    - for every question
        - add a one prompt for that day (assume the question is daily)
    - filter prompts that have already been answered
       - if already receive answer for that question for that day, then filter it out
    - return prompt list

*/

export { QuestionQueue }
