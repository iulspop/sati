import { QuestionQueue } from './prompt'

describe('create question story', () => {
  it('when I create a question, then I should receive a prompt at the times I set', () => {
    const questionQueue = QuestionQueue()

    questionQueue.createQuestion({ id: 1, question: 'Did you study 2 hours today?' })
    const promptList = questionQueue.query()

    expect(promptList).toEqual([{ questionId: 1, question: 'Did you study 2 hours today?' }])

    // given a prompt, when I enter an answer
    const answer = { questionId: 1, id: 1, answer: true }
    questionQueue.answerPrompt(answer)

    // then the answer is recorded
    expect(questionQueue.getAnswers()).toEqual([answer])
  })
})
