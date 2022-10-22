import { QuestionQueue } from './prompt'

describe('create question story', () => {
  it('when I create a question, then I should receive a prompt at the times I set', () => {
    const questionQueue = QuestionQueue()

    questionQueue.createQuestion({ id: 1, question: 'Did you study 2 hours today?' })
    const promptList = questionQueue.query()

    expect(promptList).toEqual([{ questionId: 1, question: 'Did you study 2 hours today?' }])
  })
})

/*

  createPrompt
    => add to prompt list

  queryQuestionQueue
    => check the prompt list and answers list, return a list of questions that have not been answered

  answerQuestion


  questionQueue.createPrompt
  questionQueue.query
  questionQueue.answerQuestion
  questionQueue.getAnswers

*/
