import { beforeEach, test } from 'vitest'

import { db } from '~/database.server'

import { RecurringQuestionRepository } from '../../infrastructure/recurring-question-prisma'
import type { RecurringQuestion } from '../entities/recurring-question'
import { RecurringQuestions } from './recurring-questions'

beforeEach(async () => {
  await db.recurringQuestion.deleteMany()
})

test('RecurringQuestions CRUD', async () => {
  const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
  const recurringQuestion: Partial<RecurringQuestion> = {
    question: 'Go to Bed By 9:30PM',
    order: 10,
    phase: {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      utcOffsetInMinutes: 0,
    },
  }
  const recurringQuestion2: Partial<RecurringQuestion> = {
    question: 'Go to Bed By 9:00PM',
    order: 1,
    phase: {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      utcOffsetInMinutes: 0,
    },
  }

  // CREATE
  const createdRecurringQuestion = await recurringQuestions.create(recurringQuestion)
  expect(createdRecurringQuestion).toEqual({ id: createdRecurringQuestion.id, ...recurringQuestion })

  // READ
  const readRecurringQuestion = await recurringQuestions.read(createdRecurringQuestion.id)
  let readRecurringQuestions = await recurringQuestions.readAll()
  expect(readRecurringQuestion).toEqual(createdRecurringQuestion)
  expect(readRecurringQuestions).toEqual([createdRecurringQuestion])

  // readAll returns in asc order
  const createdRecurringQuestion2 = await recurringQuestions.create(recurringQuestion2)
  readRecurringQuestions = await recurringQuestions.readAll()
  expect(readRecurringQuestions).toEqual([createdRecurringQuestion2, createdRecurringQuestion])

  // UPDATE
  const question = 'Go to Bed By 9:00PM'
  const updatedRecurringQuestion = await recurringQuestions.update(createdRecurringQuestion.id, { question })
  expect(updatedRecurringQuestion).toEqual({ ...createdRecurringQuestion, question })

  // DELETE
  const deletedRecurringQuestion = await recurringQuestions.delete(createdRecurringQuestion.id)
  readRecurringQuestions = await recurringQuestions.readAll()
  expect(deletedRecurringQuestion).toEqual(updatedRecurringQuestion)
  expect(readRecurringQuestions).toEqual([createdRecurringQuestion2])
})

test('given creating a recurring question: default order to last order + 1', async () => {
  const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
  const recurringQuestion: Partial<RecurringQuestion> = {
    question: 'X',
    phase: {
      timestamp: new Date('2022-10-22T00:00:00.000Z'),
      utcOffsetInMinutes: 0,
    },
  }
  await recurringQuestions.create({ ...recurringQuestion, id: '1', order: 10 })
  await recurringQuestions.create({ ...recurringQuestion, id: '2' })

  const readRecurringQuestions = await recurringQuestions.readAll()
  expect(readRecurringQuestions).toEqual([
    { ...recurringQuestion, id: '1', order: 10 },
    { ...recurringQuestion, id: '2', order: 11 },
  ])
})
