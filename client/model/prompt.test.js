import { PromptQueue } from './prompt'

describe('create question story', () => {
  it('when I create a question, then I should receive a prompt at the times I set', () => {
    const promptQueue = PromptQueue()

    promptQueue.createQuestion({ id: 1, question: 'Did you study 2 hours today?' })
    let promptList = promptQueue.query() //Changed from const to let.

    expect(promptList).toEqual([{ questionId: 1, question: 'Did you study 2 hours today?' }])

    // given a prompt, when I enter an answer
    const answer = { questionId: 1, id: 1, answer: true }
    promptQueue.answerPrompt(answer)

    // then the answer is recorded
    expect(promptQueue.getAnswers()).toEqual([answer])

    // if a prompt has been answered, then it should be filtered out of the prompt list
    promptList = promptQueue.query()

    expect(promptList).toEqual([])
  })
})
