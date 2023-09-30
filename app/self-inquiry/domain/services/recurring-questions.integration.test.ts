import { saveFakeUserProfileToDatabase } from 'playwright/utils'
import { describe, expect, test } from 'vitest'
import { deleteUserProfileFromDatabaseById } from '~/self-inquiry/infrastructure/user-profile-model.server'
import { RecurringQuestionRepository } from '../../infrastructure/recurring-question-repository.server'
import type { CreateRecurringQuestionCommand } from '../entities/recurring-question'
import { RecurringQuestionsService } from './recurring-questions'

describe('RecurringQuestionsService()', () => {
  test('CRUD', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestionsService = RecurringQuestionsService(RecurringQuestionRepository())
    const recurringQuestion: CreateRecurringQuestionCommand = {
      userId,
      text: 'Go to Bed By 9:30PM',
      order: 10,
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      utcOffsetInMinutes: 0,
    }
    const recurringQuestion2: CreateRecurringQuestionCommand = {
      userId,
      text: 'Go to Bed By 9:00PM',
      order: 1,
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      utcOffsetInMinutes: 0,
    }

    // CREATE
    const createdRecurringQuestion = await recurringQuestionsService.create(recurringQuestion)
    expect(createdRecurringQuestion).toEqual({ id: createdRecurringQuestion.id, ...recurringQuestion })

    // READ
    const readRecurringQuestion = await recurringQuestionsService.read(createdRecurringQuestion.id)
    let readRecurringQuestions = await recurringQuestionsService.readAll(userId)
    expect(readRecurringQuestion).toEqual(createdRecurringQuestion)
    expect(readRecurringQuestions).toEqual([createdRecurringQuestion])

    // readAll returns in asc order
    const createdRecurringQuestion2 = await recurringQuestionsService.create(recurringQuestion2)
    readRecurringQuestions = await recurringQuestionsService.readAll(userId)
    expect(readRecurringQuestions).toEqual([createdRecurringQuestion2, createdRecurringQuestion])

    // UPDATE
    const questionText = 'Go to Bed By 9:00PM'
    const updatedRecurringQuestion = await recurringQuestionsService.update(createdRecurringQuestion.id, {
      text: questionText,
    })
    expect(updatedRecurringQuestion).toEqual({ ...createdRecurringQuestion, text: questionText })

    // DELETE
    const deletedRecurringQuestion = await recurringQuestionsService.delete(createdRecurringQuestion.id)
    readRecurringQuestions = await recurringQuestionsService.readAll(userId)
    expect(deletedRecurringQuestion).toEqual(updatedRecurringQuestion)
    expect(readRecurringQuestions).toEqual([createdRecurringQuestion2])

    await deleteUserProfileFromDatabaseById(userId)
  })

  test('given creating a recurring question: default order to last order + 1', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestionsService = RecurringQuestionsService(RecurringQuestionRepository())
    const recurringQuestion: CreateRecurringQuestionCommand = {
      userId,
      text: 'X',
      timestamp: new Date('2022-10-22T00:00:00.000Z'),
      utcOffsetInMinutes: 0,
    }
    const createdRecurringQuestion = await recurringQuestionsService.create({ ...recurringQuestion, order: 10 })
    const secondCreatedRecurringQuestion = await recurringQuestionsService.create({ ...recurringQuestion })

    const readRecurringQuestions = await recurringQuestionsService.readAll(userId)
    expect(readRecurringQuestions).toEqual([
      { ...createdRecurringQuestion, order: 10 },
      { ...secondCreatedRecurringQuestion, order: 11 },
    ])

    await deleteUserProfileFromDatabaseById(userId)
  })

  test('given readAll with userId: returns all recurring questions for a given user and not from others', async () => {
    const { id: userId } = await saveFakeUserProfileToDatabase({})
    const { id: secondUserId } = await saveFakeUserProfileToDatabase({})

    const recurringQuestionsService = RecurringQuestionsService(RecurringQuestionRepository())
    const createdRecurringQuestion = await recurringQuestionsService.create({
      userId,
      text: 'N/A',
      timestamp: new Date(),
      utcOffsetInMinutes: 500,
    })
    await recurringQuestionsService.create({
      userId: secondUserId,
      text: 'N/A',
      timestamp: new Date(),
      utcOffsetInMinutes: 500,
    })

    const readRecurringQuestions = await recurringQuestionsService.readAll(userId)
    expect(readRecurringQuestions).toEqual([createdRecurringQuestion])

    await deleteUserProfileFromDatabaseById(userId)
    await deleteUserProfileFromDatabaseById(secondUserId)
  })
})
