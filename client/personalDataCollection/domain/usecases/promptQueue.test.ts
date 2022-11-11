import { PromptQueue, toDayList, addDay } from './promptQueue'
import answerRepositoryInMemory from '../../infrastructure/answerRepositoryInMemory'
import recurringQuestionRepositoryInMemory from '../../infrastructure/recurringQuestionRepositoryInMemory'
import { describe } from 'vitest'
import { assert } from '~/test/assert'

describe('promptQueue()', async () => {
  const promptQueue = PromptQueue(answerRepositoryInMemory())(recurringQuestionRepositoryInMemory())

  // Create Recurring Question
  const startDate = new Date(2022, 9, 22, 0, 0, 0)
  await promptQueue.saveRecurringQuestion({
    id: '1',
    question: 'Did you study 2 hours today?',
    startDate,
  })
  const promptList = await promptQueue.query(addDay(startDate))

  assert({
    given: 'a query the day after the start date',
    should: 'return two prompts, one for each day',
    actual: promptList,
    expected: [
      { questionId: '1', question: 'Did you study 2 hours today?', date: startDate },
      { questionId: '1', question: 'Did you study 2 hours today?', date: addDay(startDate) },
    ],
  })

  // Answer a Prompt
  const answer = { questionId: '1', date: new Date(startDate), answer: true }
  await promptQueue.answerPrompt(answer)

  assert({
    given: 'a prompt answered',
    should: 'save one answer',
    actual: await promptQueue.getAnswers(),
    expected: [answer],
  })

  assert({
    given: 'a prompt answered',
    should: 'not show the prompt again',
    actual: await promptQueue.query(addDay(startDate)),
    expected: [{ questionId: '1', question: 'Did you study 2 hours today?', date: addDay(startDate) }],
  })
})

describe('toDayList()', () => {
  const startDate = new Date(2022, 9, 22, 0, 0, 0, 0)
  const endDate = new Date(2022, 9, 24, 0, 0, 0, 0)

  assert({
    given: 'a date and another date 2 days after',
    should: 'return a list of 3 dates',
    actual: toDayList(startDate, endDate),
    expected: [startDate, addDay(startDate), endDate],
  })
})
