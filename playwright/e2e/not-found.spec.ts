import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { deleteUserProfileFromDatabaseById } from '~/features/user-profile/user-profile-model.server'
import { loginAndSaveUserProfileToDatabase } from '../utils'

test.describe('not found page', () => {
  test('given user is logged in: the page renders a link that redirects to the home page', async ({
    page,
    baseURL,
  }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })
    await page.goto('./some-non-existing-url')

    await page.getByRole('link', { name: /home/i }).click()
    await page.waitForURL(baseURL + '/queue')
    await expect(page.getByRole('heading', { name: /questions/i, level: 1 })).toBeVisible()
    const currentUrl = new URL(page.url())
    expect(currentUrl.origin + currentUrl.pathname).toEqual(baseURL + '/queue')

    await deleteUserProfileFromDatabaseById(id)
  })

  test('given user is logged out: the page renders the correct title, a useful error message and a link that redirects to the landing page', async ({
    page,
    baseURL,
  }) => {
    await page.goto('./some-non-existing-url')

    expect(await page.title()).toEqual('404 Not Found | Inquire')
    await expect(page.getByRole('heading', { name: /page not found/i, level: 1 })).toBeVisible()

    await page.getByRole('link', { name: /home/i }).click()
    await page.waitForURL(baseURL + '/')
    expect(page.url()).toEqual(baseURL + '/')
  })

  test('given user is logged out: page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('./some-non-existing-url')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
