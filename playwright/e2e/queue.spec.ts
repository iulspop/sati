import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { deleteUserProfileFromDatabaseById } from '~/features/user-profile/user-profile-model.server'
import { loginAndSaveUserProfileToDatabase } from '../utils'

test.describe('queue page', () => {
  test('given user is logged in: has the correct title', async ({ page }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')

    expect(await page.title()).toEqual('Home | Inquire')

    await deleteUserProfileFromDatabaseById(id)
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
