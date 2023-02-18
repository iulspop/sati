import { beforeEach, test } from 'vitest'

import { db } from '../../../db.server'
import { AnswerRepository } from '../../infrastructure/answer-prisma'
import { RecurringQuestionRepository } from '../../infrastructure/recurring-question-prisma'
import type { Answer } from '../entities/answer'
import { Answers } from './answers'
import { RecurringQuestions } from './recurring-questions'

beforeEach(async () => {
  await db.recurringQuestion.deleteMany()
})

test('Answers CRUD', async () => {
  const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
  const createdRecurringQuestion = await recurringQuestions.create({})

  const answers = Answers(AnswerRepository())
  const answer: Partial<Answer> = {
    questionId: createdRecurringQuestion.id,
    response: false,
    timestamp: new Date(),
  }

  // CREATE
  const createdAnswer = await answers.create(answer)
  expect(createdAnswer).toEqual({ id: createdAnswer.id, ...answer })

  // READ
  const readAnswer = await answers.read(createdAnswer.id)
  let readAnswers = await answers.readAll()
  expect(readAnswer).toEqual(createdAnswer)
  expect(readAnswers).toEqual([createdAnswer])

  // UPDATE
  const updatedResponse = true
  const updatedAnswer = await answers.update(createdAnswer.id, { response: updatedResponse })
  expect(updatedAnswer).toEqual({ ...createdAnswer, response: updatedResponse })

  // DELETE
  const deletedAnswer = await answers.delete(createdAnswer.id)
  readAnswers = await answers.readAll()
  expect(deletedAnswer).toEqual(updatedAnswer)
  expect(readAnswers).toEqual([])
})
