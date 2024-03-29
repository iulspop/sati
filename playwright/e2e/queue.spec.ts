import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { CreateRecurringQuestionCommand } from '~/self-inquiry/domain/entities/recurring-question'
import { recurringQuestionsService } from '~/self-inquiry/domain/index.server'
import { deleteUserProfileFromDatabaseById } from '~/self-inquiry/infrastructure/user-profile-model.server'
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
    const recurringQuestion: CreateRecurringQuestionCommand = {
      userId,
      text: 'Brushed Teeth?',
      timestamp: daysAgo(1),
      utcOffsetInMinutes: 0,
    }
    const recurringQuestion2: CreateRecurringQuestionCommand = {
      userId,
      text: 'Gone to Bed By 9:00PM?',
      timestamp: daysAgo(2),
      utcOffsetInMinutes: 0,
    }

    await recurringQuestionsService.create(recurringQuestion)
    await recurringQuestionsService.create(recurringQuestion2)

    await page.goto('./queue')

    await expect(page.getByText(recurringQuestion.text)).toHaveCount(1)
    await expect(page.getByText(recurringQuestion2.text)).toHaveCount(2)

    await page.locator(`form:has-text('${recurringQuestion.text}')`).getByRole('button', { name: /yes/i }).click()
    await expect(page.getByText(recurringQuestion.text)).toHaveCount(0)

    await deleteUserProfileFromDatabaseById(userId)
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

  test('given user is logged in: page should not have any automatically detectable accessibility issues', async ({ page }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    await deleteUserProfileFromDatabaseById(id)
  })
})
