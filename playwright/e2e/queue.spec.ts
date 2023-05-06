import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { db } from '~/database.server'
import type { RecurringQuestion } from '~/domains/self-data-collection/domain/entities/recurring-question'
import { RecurringQuestions } from '~/domains/self-data-collection/domain/index.server'
import { deleteUserProfileFromDatabaseById } from '~/features/user-profile/user-profile-model.server'
import { daysAgo, loginAndSaveUserProfileToDatabase } from '../utils'

test.describe('queue page', () => {
  test('given user is logged in: has the correct title', async ({ page }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')

    expect(await page.title()).toEqual('Home | Inquire')

    await deleteUserProfileFromDatabaseById(id)
  })

  test('given user is logged in: loads prompt queue', async ({ page }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })
    const recurringQuestion: Partial<RecurringQuestion> = {
      question: 'Brushed Teeth?',
      order: 10,
      phase: {
        timestamp: daysAgo(1),
        utcOffsetInMinutes: 0,
      },
    }
    const recurringQuestion2: Partial<RecurringQuestion> = {
      question: 'Gone to Bed By 9:00PM?',
      order: 1,
      phase: {
        timestamp: daysAgo(2),
        utcOffsetInMinutes: 0,
      },
    }

    const { id: recurringQuestionId } = await RecurringQuestions.create(recurringQuestion)
    const { id: recurringQuestionId2 } = await RecurringQuestions.create(recurringQuestion2)

    try {
      await page.goto('./queue')

      await expect(page.getByText(recurringQuestion.question)).toHaveCount(1)
      await expect(page.getByText(recurringQuestion2.question)).toHaveCount(2)

      await page.locator(`form:has-text('${recurringQuestion.question}')`).getByRole('button', { name: /yes/i }).click()
      await expect(page.getByText(recurringQuestion.question)).toHaveCount(0)
    } finally {
      await RecurringQuestions.delete(recurringQuestionId)
      await RecurringQuestions.delete(recurringQuestionId2)
      await db.answer.deleteMany({
        where: {
          questionId: {
            equals: recurringQuestionId,
          },
        },
      })
      await db.answer.deleteMany({
        where: {
          questionId: {
            equals: recurringQuestionId,
          },
        },
      })
      await deleteUserProfileFromDatabaseById(userId)
    }
  })

  test('given user is logged in and there are not query parameters: redirects to the queue page with the timeZone query parameter', async ({
    page,
    baseURL,
  }) => {
    const { id: userId } = await loginAndSaveUserProfileToDatabase({ page })

    await page.goto(`${baseURL}/queue`)
    await page.waitForURL(`${baseURL}/queue?timeZone=*`, { timeout: 5000 })

    const currentUrl = new URL(page.url())
    expect(currentUrl.searchParams.get('timeZone')).toBeTruthy()

    await deleteUserProfileFromDatabaseById(userId)
  })

  test('given user is logged in: lets the user log out', async ({ page, baseURL }) => {
    await page.route('/logout', async route => {
      await page.context().clearCookies()
      return route.fulfill({
        headers: { ...route.request().headers(), Location: '/' },
        status: 302,
      })
    })

    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /log out/i }).click()
    expect(page.url()).toEqual(baseURL + '/')

    // Verify user is really logged out by trying to visit the queue page and getting redirected to login.
    await page.goto('./queue')
    expect(page.url()).toContain('/login')

    await deleteUserProfileFromDatabaseById(id)
  })

  test('given user is logged out: page redirects you to the login page and remembers the page as the redirectTo query parameter', async ({
    page,
    baseURL,
  }) => {
    await page.goto('./queue')
    const expectedUrl = new URL(baseURL + '/login')
    expectedUrl.searchParams.append('redirectTo', '/queue')
    expect(page.url()).toEqual(expectedUrl.href)
  })

  test('given user is logged in: page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    await deleteUserProfileFromDatabaseById(id)
  })
})
