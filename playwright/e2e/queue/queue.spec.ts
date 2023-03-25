import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { deleteUserProfileFromDatabaseById } from '~/features/user-profile/user-profile-model.server'

import { loginAndSaveUserProfileToDatabase } from '../../utils'

test.describe('home page', () => {
  test("page redirects you to the login page when you're logged out and remembers the page as the redirectTo query parameter", async ({
    page,
    baseURL,
  }) => {
    await page.goto('./queue')
    const expectedUrl = new URL(baseURL + '/login')
    expectedUrl.searchParams.append('redirectTo', '/queue')
    expect(page.url()).toEqual(expectedUrl.href)
  })

  test('given the user is logged in: lets the user log out', async ({ page, baseURL, isMobile, browserName }) => {
    // See: https://github.com/microsoft/playwright/issues/18318
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'webkit', 'webkit does not support redirects in route.fulfill')
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'chromium' && !!isMobile, 'Mobile Chrome is currently broken')

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

    // Logging the user out should redirect you to the landing page.
    await page.getByRole('button', { name: /log out/i }).click()
    expect(page.url()).toEqual(baseURL + '/')

    // Verify that the user is really logged out by trying to visit the queue
    // page and getting redirected to login.
    await page.goto('./queue')
    expect(page.url()).toContain('/login')

    await page.close()
    await deleteUserProfileFromDatabaseById(id)
  })

  test('given the user is logged in: has the correct title', async ({ page }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')

    // The page has the correct tile.
    expect(await page.title()).toEqual('Home | Inquire')

    await page.close()
    await deleteUserProfileFromDatabaseById(id)
  })

  test('page should not have any automatically detectable accessibility issues', async ({ page }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./queue')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])

    await page.close()
    await deleteUserProfileFromDatabaseById(id)
  })

  test('given there is no user profile for the given user: renders a message to the user', ({}, testInfo) => {
    testInfo.fixme()
  })
})
