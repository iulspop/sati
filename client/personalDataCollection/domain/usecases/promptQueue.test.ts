import { describe } from 'vitest'
import { assert } from '~/test/assert'

import { PromptQueue, toDayList, addDay } from './promptQueue'
import answerRepositoryInMemory from '../../infrastructure/answerRepositoryInMemory'
import recurringQuestionRepositoryInMemory from '../../infrastructure/recurringQuestionRepositoryInMemory'
import Prompt from '../../domain/entities/prompt'
import { Answer } from '../../domain/entities/answer'

describe('promptQueue()', async () => {
  const promptQueue = PromptQueue(recurringQuestionRepositoryInMemory())(answerRepositoryInMemory())
  const startDate = new Date(2022, 9, 22, 0, 0, 0)
  const firstDayPrompt: Prompt = { questionId: '1', question: 'Did you study 2 hours today?', timestamp: startDate }
  const secondDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours today?',
    timestamp: addDay(startDate),
  }
  const firstDayAnswer: Answer = { id: '1', questionId: '1', timestamp: new Date(startDate), response: true }

  await promptQueue.createRecurringQuestion({
    id: '1',
    question: 'Did you study 2 hours today?',
    startDate,
  })

  assert({
    given: 'a query the day after the start date',
    should: 'return two prompts, one for each day',
    actual: await promptQueue.query(addDay(startDate)),
    expected: [firstDayPrompt, secondDayPrompt],
  })

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
