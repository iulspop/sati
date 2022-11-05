import { PromptQueue, toDayList, addDay } from './prompt'

describe('create question story', () => {
  it('when I create a question, then I should receive a prompt at the times I set', () => {
    const promptQueue = PromptQueue()

    // Create Recurring Question
    const startDate = new Date(2022, 9, 22, 0, 0, 0)
    promptQueue.createRecurringQuestion({
      id: 1,
      question: 'Did you study 2 hours today?',
      startDate,
    })

    // Query Prompts
    let promptList = promptQueue.query(addDay(startDate))
    expect(promptList).toEqual([
      { questionId: 1, question: 'Did you study 2 hours today?', date: startDate },
      { questionId: 1, question: 'Did you study 2 hours today?', date: addDay(startDate) },
    ])

    // Answer Prompt
    const answer = { questionId: 1, date: new Date(startDate), answer: true }
    promptQueue.answerPrompt(answer)
    expect(promptQueue.getAnswers()).toEqual([answer])

    // Answered Prompts Should Not Prompt Again
    promptList = promptQueue.query(addDay(startDate))
    expect(promptList).toEqual([{ questionId: 1, question: 'Did you study 2 hours today?', date: addDay(startDate) }])
  })
})

describe('toDayList funct', () => {
  it('creates a list of dates from a startDate and endDate', () => {
    const startDate = new Date(2022, 9, 22, 0, 0, 0, 0)
    const endDate = new Date(2022, 9, 24, 0, 0, 0, 0)

    expect(toDayList(startDate, endDate)).toEqual([startDate, addDay(startDate), endDate])
  })
})
