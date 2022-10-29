import { PromptQueue, toDayList, addDay } from './prompt'

describe.skip('create question story', () => {
  it('when I create a question, then I should receive a prompt at the times I set', () => {
    const promptQueue = PromptQueue()

    const startDate = new Date(2022, 9, 22, 0, 0, 0, 0)
    promptQueue.createRecurringQuestion({
      id: 1,
      question: 'Did you study 2 hours today?',
      startDate,
    })
    let promptList = promptQueue.query(addDay(startDate))
    expect(promptList).toEqual([
      { questionId: 1, question: 'Did you study 2 hours today?', date: startDate },
      { questionId: 1, question: 'Did you study 2 hours today?', date: addDay(startDate) },
    ]);

    const answer = { questionId: 1, date: startDate, answer: true }
    promptQueue.answerPrompt(answer)
    expect(promptQueue.getAnswers()).toEqual([answer])

    promptList = promptQueue.query(addDay(startDate))
    expect(promptList).toEqual([
      { questionId: 2, question: 'Did you study 2 hours today?', date: addDay(startDate) },
    ])
  })
})

describe('toDayList funct', () => {
  test("Test toDayList function", () => {
    const startDate = new Date(2022, 9, 22, 0, 0, 0, 0);
    const endDate = new Date(2022, 9, 24, 0, 0, 0, 0);

    expect(toDayList(startDate, endDate)).toEqual([startDate, addDay(startDate), endDate]);
  })
})

/*

TODO:
- Add notion of date & time to the prompt queue
  - Recurring Question should have a start date (stores timestamp not date object)
  - Querying queue takes a timestamp
  - Answers should have a timestamp
  - PromptQueue should filter out questions that have already been answered for their specific date
- Create recurring question at different intervals

*/
