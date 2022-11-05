import { PromptQueue, toDayList, addDay, addDays } from './prompt'

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
    let promptList = promptQueue.query(addDays(startDate))
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

/*

TODO:
Next Steps:
- Define port interface
  - options: it write down or define a typescript interface and/or write contract test
- Implement port interface as CLI adapter
  - CLI adapter should have contract test
- Create CLI program

Future Features:
- Create recurring question at different intervals
  - Current interval is assumed to be 1 day



Ports & Adapters

Ports
  well-defined interfaces for interacting with domain core

GUI => GUI Adapter (implements port API/interface/contract) => Domain Core
CLI => CLI Adapter (implements port API/interface/contract) => Domain Core

Adapters

*/
