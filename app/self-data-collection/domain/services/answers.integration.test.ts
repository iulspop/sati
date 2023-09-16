import { saveFakeUserProfileToDatabase } from 'playwright/utils'
import { describe, expect, test } from 'vitest'
import { deleteUserProfileFromDatabaseById } from '~/self-data-collection/infrastructure/user-profile-model.server'
import { AnswerRepository } from '../../infrastructure/answer-repository.server'
import { RecurringQuestionRepository } from '../../infrastructure/recurring-question-repository.server'
import type { Answer } from '../entities/answer'
import { Answers } from './answers'
import { RecurringQuestions } from './recurring-questions'

describe('Answers()', () => {
  test('CRUD', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
    const createdRecurringQuestion = await recurringQuestions.create({
      userId,
      text: 'N/A',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: 500,
      },
    })

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
    let readAnswers = await answers.readAll(userId)
    expect(readAnswer).toEqual(createdAnswer)
    expect(readAnswers).toEqual([createdAnswer])

    // UPDATE
    const updatedResponse = true
    const updatedAnswer = await answers.update(createdAnswer.id, { response: updatedResponse })
    expect(updatedAnswer).toEqual({ ...createdAnswer, response: updatedResponse })

    // DELETE
    const deletedAnswer = await answers.delete(createdAnswer.id)
    readAnswers = await answers.readAll(userId)
    expect(deletedAnswer).toEqual(updatedAnswer)
    expect(readAnswers).toEqual([])

    await deleteUserProfileFromDatabaseById(userId)
  })

  test('given readAll with userId: returns all answers for a given user and not from others', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})
    const { id: secondUserId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
    const createdRecurringQuestion = await recurringQuestions.create({
      userId,
      text: 'N/A',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: 500,
      },
    })
    const secondCreatedRecurringQuestion = await recurringQuestions.create({
      userId: secondUserId,
      text: 'N/A',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: 500,
      },
    })

    const answers = Answers(AnswerRepository())
    const createdAnswer = await answers.create({
      questionId: createdRecurringQuestion.id,
      response: false,
      timestamp: new Date(),
    })
    await answers.create({
      questionId: secondCreatedRecurringQuestion.id,
      response: false,
      timestamp: new Date(),
    })

    // @ts-ignore
    const readAnswers = await answers.readAll(userId)
    expect(readAnswers).toEqual([createdAnswer])

    await deleteUserProfileFromDatabaseById(userId)
  })
})
