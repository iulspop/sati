import { saveFakeUserProfileToDatabase } from 'playwright/utils'
import { describe, expect, test } from 'vitest'
import { deleteUserProfileFromDatabaseById } from '~/self-data-collection/infrastructure/user-profile-model.server'
import { AnswerRepository } from '../../infrastructure/answer-repository.server'
import { RecurringQuestionRepository } from '../../infrastructure/recurring-question-repository.server'
import type { Answer } from '../entities/answer'
import { AnswersService } from './answers'
import { RecurringQuestionsService } from './recurring-questions'

describe('AnswersService()', () => {
  test('CRUD', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestionsService = RecurringQuestionsService(RecurringQuestionRepository())
    const createdRecurringQuestion = await recurringQuestionsService.create({
      userId,
      text: 'N/A',
      timestamp: new Date(),
      utcOffsetInMinutes: 500,
    })

    const answersService = AnswersService(AnswerRepository())
    const answer: Partial<Answer> = {
      questionId: createdRecurringQuestion.id,
      response: false,
      timestamp: new Date(),
    }

    // CREATE
    const createdAnswer = await answersService.create(answer)
    expect(createdAnswer).toEqual({ id: createdAnswer.id, ...answer })

    // READ
    const readAnswer = await answersService.read(createdAnswer.id)
    let readAnswers = await answersService.readAll(userId)
    expect(readAnswer).toEqual(createdAnswer)
    expect(readAnswers).toEqual([createdAnswer])

    // UPDATE
    const updatedResponse = true
    const updatedAnswer = await answersService.update(createdAnswer.id, { response: updatedResponse })
    expect(updatedAnswer).toEqual({ ...createdAnswer, response: updatedResponse })

    // DELETE
    const deletedAnswer = await answersService.delete(createdAnswer.id)
    readAnswers = await answersService.readAll(userId)
    expect(deletedAnswer).toEqual(updatedAnswer)
    expect(readAnswers).toEqual([])

    await deleteUserProfileFromDatabaseById(userId)
  })

  test('given readAll with userId: returns all answers for a given user and not from others', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})
    const { id: secondUserId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestionsService = RecurringQuestionsService(RecurringQuestionRepository())
    const createdRecurringQuestion = await recurringQuestionsService.create({
      userId,
      text: 'N/A',
      timestamp: new Date(),
      utcOffsetInMinutes: 500,
    })
    const secondCreatedRecurringQuestion = await recurringQuestionsService.create({
      userId: secondUserId,
      text: 'N/A',
      timestamp: new Date(),
      utcOffsetInMinutes: 500,
    })

    const answersService = AnswersService(AnswerRepository())
    const createdAnswer = await answersService.create({
      questionId: createdRecurringQuestion.id,
      response: false,
      timestamp: new Date(),
    })
    await answersService.create({
      questionId: secondCreatedRecurringQuestion.id,
      response: false,
      timestamp: new Date(),
    })

    // @ts-ignore
    const readAnswers = await answersService.readAll(userId)
    expect(readAnswers).toEqual([createdAnswer])

    await deleteUserProfileFromDatabaseById(userId)
  })
})
