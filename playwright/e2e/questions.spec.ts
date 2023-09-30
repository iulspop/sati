import AxeBuilder from '@axe-core/playwright'
import { createId } from '@paralleldrive/cuid2'
import { expect, test } from '@playwright/test'
import type { Answer } from '~/self-inquiry/domain/entities/answer'
import { answerFactory } from '~/self-inquiry/domain/entities/answer'
import type { CreateRecurringQuestionCommand } from '~/self-inquiry/domain/entities/recurring-question'
import { answersService, recurringQuestionsService } from '~/self-inquiry/domain/index.server'
import { deleteUserProfileFromDatabaseById } from '~/self-inquiry/infrastructure/user-profile-model.server'
import { loginAndSaveUserProfileToDatabase } from '../utils'

test.describe('questions page', () => {
  test('given user is logged in: loads one of each of their recurring questions', async ({ page }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })
    const recurringQuestion: CreateRecurringQuestionCommand = {
      userId,
      text: 'Brushed Teeth?',
      order: 1,
      timestamp: new Date(),
      utcOffsetInMinutes: new Date().getTimezoneOffset(),
    }
    const recurringQuestion2: CreateRecurringQuestionCommand = {
      userId,
      text: 'Gone to Bed By 9:00PM?',
      order: 2,
      timestamp: new Date(),
      utcOffsetInMinutes: new Date().getTimezoneOffset(),
    }
    await recurringQuestionsService.create(recurringQuestion)
    await recurringQuestionsService.create(recurringQuestion2)

    try {
      await page.goto('./questions')
      const listItems = page.getByRole('listitem')
      await expect(listItems.filter({ hasText: recurringQuestion.text })).toHaveCount(1)
      await expect(listItems.filter({ hasText: recurringQuestion2.text })).toHaveCount(1)
    } finally {
      await deleteUserProfileFromDatabaseById(userId)
    }
  })

  test('given user is logged in: can create a recurring question', async ({ page, baseURL }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })
    const expectedQuestionText = 'Did you eat your vegetables?'

    try {
      await page.goto('./questions')

      await page.getByRole('link', { name: /add question/i }).click()
      await page.getByLabel(/What recurring question to add?/i).fill(expectedQuestionText)
      await page.getByRole('button', { name: /submit/i }).click()

      await expect(page).toHaveURL(`${baseURL}/questions`)
      const listItems = page.getByRole('listitem')
      await expect(listItems.filter({ hasText: expectedQuestionText })).toHaveCount(1)
    } finally {
      await deleteUserProfileFromDatabaseById(userId)
    }
  })

  test('given user is logged in, clicking a recurring question and clicking delete: deletes the question', async ({ page, baseURL }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })
    const recurringQuestion: CreateRecurringQuestionCommand = {
      id: createId(),
      userId,
      text: 'Brushed Teeth?',
      order: 1,
      timestamp: new Date(),
      utcOffsetInMinutes: new Date().getTimezoneOffset(),
    }
    await recurringQuestionsService.create(recurringQuestion)

    try {
      await page.goto('./questions')
      await expect(page.getByText(recurringQuestion.text), 'should see the question').toBeVisible()

      await page.getByRole('link', { name: recurringQuestion.text }).click()
      await expect(page, 'should link to the "questions/:id" page').toHaveURL(`${baseURL}/questions/${recurringQuestion.id}`)
      await expect(page.getByText(recurringQuestion.text), 'should see the question').toBeVisible()

      await page.getByRole('button', { name: 'Delete' }).click()
      await expect(page, 'should redirect to "/questions" after deleting question').toHaveURL(`${baseURL}/questions`)
      await expect(page.getByText(recurringQuestion.text), 'should not see the question anymore').toHaveCount(0)
    } finally {
      await deleteUserProfileFromDatabaseById(userId)
    }
  })

  test('given user is logged in, clicking a recurring question: lists each respective answer to the question', async ({ page }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })

    const recurringQuestion: CreateRecurringQuestionCommand = {
      id: createId(),
      userId,
      text: 'Brushed Teeth?',
      order: 1,
      timestamp: new Date(),
      utcOffsetInMinutes: new Date().getTimezoneOffset(),
    }
    await recurringQuestionsService.create(recurringQuestion)

    const answers: Answer[] = [
      answerFactory({ timestamp: new Date(), response: true, questionId: recurringQuestion.id }),
      answerFactory({ timestamp: new Date(), response: false, questionId: recurringQuestion.id }),
    ]
    await answersService.create(answers[0])
    await answersService.create(answers[1])

    try {
      await page.goto('./questions')
      await page.getByRole('link', { name: recurringQuestion.text }).click()
      await expect(page.getByText('False'), 'should see the first answer').toBeVisible()
      await expect(page.getByText('True'), 'should see the second answer').toBeVisible()
    } finally {
      await deleteUserProfileFromDatabaseById(userId)
    }
  })

  test('given user is logged out: page redirects you to the login page and remembers the page as the redirectTo query parameter', async ({
    page,
    baseURL,
  }) => {
    await page.goto('./questions')
    const expectedUrl = new URL(baseURL + '/login')
    expectedUrl.searchParams.append('redirectTo', '/questions')
    expect(page.url()).toEqual(expectedUrl.href)
  })

  test('given user is logged in: page should not have any automatically detectable accessibility issues', async ({ page }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./questions')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    await deleteUserProfileFromDatabaseById(id)
  })
})
