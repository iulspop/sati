import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { deleteUserProfileFromDatabaseById } from '~/features/user-profile/user-profile-model.server'
import { loginAndSaveUserProfileToDatabase } from '../../utils'

test.describe('landing page', () => {
  test('has the correct title and renders a header', async ({ page }) => {
    await page.goto('./')
    expect(await page.title()).toEqual('Inquire')
    await expect(page.getByRole('heading', { level: 1, name: 'Inquire' })).toBeVisible()
  })

  test("redirects you to the prompt queue page when you're logged in", async ({ page, baseURL }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })

    await page.goto('./')
    expect(page.url()).toEqual(baseURL + '/queue')

    await page.close()
    await deleteUserProfileFromDatabaseById(id)
  })

  test('page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('./')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
