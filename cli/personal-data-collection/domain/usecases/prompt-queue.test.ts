import { Answer } from '../entities/answer'
import { assert } from '~/test/assert'
import { describe } from 'vitest'
import { PromptQueue, toDayList, addDay } from './prompt-queue'
import answerRepositoryFileSystem from '~/personal-data-collection/infrastructure/answer-repository-file-system'
import Prompt from '../entities/prompt'
import recurringQuestionRepositoryFileSystem from '~/personal-data-collection/infrastructure/recurring-question-repository-file-system'
import fs from 'fs'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const storageDirPath = path.join(__dirname, '..', '..', '..', '..', 'storage')
console.log(storageDirPath)

describe('promptQueue()', async () => {
  if (fs.existsSync(path.join(storageDirPath, 'answers.json'))) fs.unlinkSync(path.join(storageDirPath, 'answers.json'))
  if (fs.existsSync(path.join(storageDirPath, 'recurring-questions.json')))
    fs.unlinkSync(path.join(storageDirPath, 'answers.json'))

  const promptQueue = PromptQueue(recurringQuestionRepositoryFileSystem())(answerRepositoryFileSystem())
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
    given: 'a query the next day after creating a recurring question',
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

  fs.unlinkSync(path.join(storageDirPath, 'answers.json'))
  fs.unlinkSync(path.join(storageDirPath, 'recurring-questions.json'))
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
