import { PromptQueue, toDayList, addDay } from './promptQueue'
import answerRepositoryInMemory from '../../infrastructure/answerRepositoryInMemory'
import recurringQuestionRepositoryInMemory from '../../infrastructure/recurringQuestionRepositoryInMemory'
import { describe } from 'vitest'
import { assert } from '~/test/assert'

describe('promptQueue()', async () => {
  const promptQueue = PromptQueue(recurringQuestionRepositoryInMemory())(answerRepositoryInMemory())

  // Create Recurring Question
  const startDate = new Date(2022, 9, 22, 0, 0, 0)
  await promptQueue.createRecurringQuestion({
    id: '1',
    question: 'Did you study 2 hours today?',
    startDate,
  })
  const firstDayPrompt = { questionId: '1', question: 'Did you study 2 hours today?', timestamp: startDate }
  const secondDayPrompt = { questionId: '1', question: 'Did you study 2 hours today?', timestamp: addDay(startDate) }

  assert({
    given: 'a query the day after the start date',
    should: 'return two prompts, one for each day',
    actual: await promptQueue.query(addDay(startDate)),
    expected: [firstDayPrompt, secondDayPrompt],
  })

  // Answer a Prompt
  const firstDayAnswer = { id: '1', questionId: '1', timestamp: new Date(startDate), response: true }
  await promptQueue.answerPrompt(firstDayAnswer)

  assert({
    given: 'one prompt answered',
    should: 'return one answer',
    actual: await promptQueue.getAnswers(),
    expected: [firstDayAnswer],
  })

  assert({
    given: 'a prompt answered',
    should: 'not show the prompt again',
    actual: await promptQueue.query(addDay(startDate)),
    expected: [secondDayPrompt],
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
