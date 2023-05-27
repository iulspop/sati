import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { RecurringQuestion } from '~/domains/self-data-collection/domain/entities/recurring-question'
import { RecurringQuestions } from '~/domains/self-data-collection/domain/index.server'
import { deleteUserProfileFromDatabaseById } from '~/routes/_auth.login/user-profile/user-profile-model.server'
import { loginAndSaveUserProfileToDatabase } from '../utils'

test.describe('questions page', () => {
  test('given user is logged in: loads one of each of their recurring questions', async ({ page }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })
    const recurringQuestion: Partial<RecurringQuestion> = {
      question: 'Brushed Teeth?',
      order: 1,
    }
    const recurringQuestion2: Partial<RecurringQuestion> = {
      question: 'Gone to Bed By 9:00PM?',
      order: 2,
    }

    const { id: recurringQuestionId } = await RecurringQuestions.create(recurringQuestion)
    const { id: recurringQuestionId2 } = await RecurringQuestions.create(recurringQuestion2)

    try {
      await page.goto('./questions')
      const listItems = page.getByRole('listitem')
      await expect(listItems.filter({ hasText: recurringQuestion.question })).toHaveCount(1)
      await expect(listItems.filter({ hasText: recurringQuestion2.question })).toHaveCount(1)
    } finally {
      await RecurringQuestions.delete(recurringQuestionId)
      await RecurringQuestions.delete(recurringQuestionId2)
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

  test('given user is logged in: page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./questions')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    await deleteUserProfileFromDatabaseById(id)
  })
})
