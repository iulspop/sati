import { Answer } from '../entities/answer'
import { assert } from '~/test/assert'
import { describe } from 'vitest'
import { PromptQueue, toDayList, filterIfCurrentDay, addDay, toStartOfDay, toLocalTime } from './prompt-queue'
import answerRepositoryFileSystem from '~/personal-data-collection/infrastructure/answer-repository-file-system'
import Prompt from '../entities/prompt'
import recurringQuestionRepositoryFileSystem from '~/personal-data-collection/infrastructure/recurring-question-repository-file-system'
import fs from 'fs'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const storageDirPath = path.join(__dirname, '..', '..', '..', '..', process.env.STORAGE_PATH)

const addHours = (hours: number, date: Date) => {
  const newDate = new Date(date)
  newDate.setHours(newDate.getHours() + hours)
  return newDate
}

describe('promptQueue()', async () => {
  if (fs.existsSync(path.join(storageDirPath, 'answers.json'))) fs.unlinkSync(path.join(storageDirPath, 'answers.json'))
  if (fs.existsSync(path.join(storageDirPath, 'recurring-questions.json')))
    fs.unlinkSync(path.join(storageDirPath, 'recurring-questions.json'))

  const promptQueue = PromptQueue(recurringQuestionRepositoryFileSystem())(answerRepositoryFileSystem())

  const startDate = new Date('2022-10-20T01:00:00.000Z')
  const startDateLocal = new Date('2022-10-19T20:00:00.000Z')
  const startOfDayInLocalTime = new Date('2022-10-19T05:00:00.000Z')

  const firstDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours today?',
    timestamp: startOfDayInLocalTime,
  }

  const secondDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours today?',
    timestamp: addDay(startOfDayInLocalTime),
  }

  const firstDayAnswer: Answer = { id: '1', questionId: '1', timestamp: new Date(startOfDayInLocalTime), response: true }

  await promptQueue.createRecurringQuestion({
    id: '1',
    question: 'Did you study 2 hours today?',
    phases: [
      {
        timestamp: startDate,
        utcOffsetInMinutes: 5 * 60,
      },
    ],
  })

  assert({
    given: 'a recurring question and a query in two days local time',
    should: 'return two prompts, one for each day except the current day',
    actual: await promptQueue.query(addHours(28, startDateLocal)),
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
    actual: await promptQueue.query(addHours(28, startDateLocal)),
    expected: [secondDayPrompt],
  })

  fs.unlinkSync(path.join(storageDirPath, 'answers.json'))
  fs.unlinkSync(path.join(storageDirPath, 'recurring-questions.json'))
  fs.rmdirSync(storageDirPath)
})

describe('filterIfCurrentDay()', () => {
  const firstDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours today?',
    timestamp: new Date('2022-10-19T05:00:00.000Z'),
  }

  const secondDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours today?',
    timestamp: new Date('2022-10-20T05:00:00.000Z'),
  }

  assert({
    given: 'a query on the 21st and prompts on the 19th and 20th',
    should: 'return the prompts on the 19th and 20th',
    actual: filterIfCurrentDay(new Date('2022-10-21T00:00:00.000Z'))([firstDayPrompt, secondDayPrompt]),
    expected: [firstDayPrompt, secondDayPrompt],
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

  assert({
    given: 'a date and another date 5 hours after after',
    should: 'return one day',
    actual: toDayList(startDate, new Date(2022, 9, 22, 5, 0, 0, 0)),
    expected: [startDate],
  })

  assert({
    given: 'a date and another date 25 hours after after',
    should: 'return two days, second day exactly 24 hours after first day',
    actual: toDayList(startDate, new Date(2022, 9, 23, 1, 0, 0, 0)),
    expected: [startDate, addDay(startDate)],
  })
})

describe('toStartOfDay()', () => {
  assert({
    given: 'a date at 8PM',
    should: 'return a date at 12AM the same day',
    actual: toStartOfDay(new Date('2022-10-19T20:01:01.500Z')),
    expected: new Date('2022-10-19T00:00:00.000Z'),
  })
})

describe('toLocalTime()', () => {
  assert({
    given: 'a date at 1AM and a UTC offset of -5 hours (EST)',
    should: 'return a date at 8PM the previous day',
    actual: toLocalTime({ timestamp: new Date('2022-10-20T01:00:00.000Z'), utcOffsetInMinutes: 5 * 60 }),
    expected: new Date('2022-10-19T20:00:00.000Z'),
  })

  assert({
    given: 'a date at 8PM and a UTC offset of 2 hours (Bucharest)',
    should: 'return a date at 10PM the same day',
    actual: toLocalTime({ timestamp: new Date('2022-10-20T20:00:00.000Z'), utcOffsetInMinutes: -2 * 60 }),
    expected: new Date('2022-10-20T22:00:00.000Z'),
  })
})
