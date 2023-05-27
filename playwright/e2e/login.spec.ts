import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import 'dotenv/config'
import { createPopulatedUserProfile } from '~/routes/_auth.login/user-profile/user-profile-factories.server'
import {
  deleteUserProfileFromDatabaseById,
  saveUserProfileToDatabase,
} from '~/routes/_auth.login/user-profile/user-profile-model.server'
import { USER_AUTHENTICATION_SESSION_NAME } from '~/routes/_auth/user-authentication-session.server'
import { createValidCookieToken, loginAndSaveUserProfileToDatabase } from '../utils'

/*

# Magic Admin SDK Error: [SERVICE_ERROR]

If you get an error as such:
```
MagicAdminSDKError:
Magic Admin SDK Error: [SERVICE_ERROR] A service error occurred while communicating with the Magic API. 
Check the `data` key of this error object to see nested errors with additional context.

{
  code: 'SERVICE_ERROR',
  data: [
    {
      data: {},
      error_code: 'RESOURCE_NOT_FOUND',
      message: 'Given issuer resource not found.',
      status: 'failed'
    }
  ]
}
```

Then it is likely because the login loader route has been changed without updating the test.

To update the `loginLoaderRoute` const appropriately:
1. Run `npx remix routes`
2. Find the route for the login `<Route path="login" file="routes/_auth.login/route.tsx" />`
3. Translate to loader route e.g. `/login?_data=routes%2F_auth.login`

*/

const loginLoaderRoute = '/login?_data=routes%2F_auth.login'
const invalidMagicEmail = 'test+fail@magic.link'
const validMagicEmail = 'test+success@magic.link'

test.describe('login page', () => {
  test('given user is logged in: redirects to the route specified in the search parameter', async ({
    page,
    baseURL,
  }) => {
    const { id } = await loginAndSaveUserProfileToDatabase({ page })

    const searchParameters = new URLSearchParams({
      redirectTo: '/queue',
    })
    await page.goto('./login?' + searchParameters.toString())
    const currentUrl = new URL(page.url())
    expect(currentUrl.origin + currentUrl.pathname).toEqual(baseURL + '/queue')

    await page.close()
    await deleteUserProfileFromDatabaseById(id)
  })

  test('given user is logged out & valid credentials are provided: logs user in', async ({ page, baseURL }) => {
    const user = createPopulatedUserProfile()
    await saveUserProfileToDatabase(user)
    const cookieToken = await createValidCookieToken(user.id)

    await page.addInitScript(() => {
      window.runMagicInTestMode = true
    })

    await page.route(loginLoaderRoute, (route, request) => {
      const postData = request.postData()

      if (postData && postData.includes('didToken')) {
        return route.fulfill({
          headers: {
            'Set-Cookie': `${USER_AUTHENTICATION_SESSION_NAME}=${cookieToken}; Max-Age=31536000; Path=/; HttpOnly; SameSite=Lax`,
            'X-Remix-Redirect': '/queue',
            'X-Remix-Revalidate': 'yes',
          },
          status: 204,
        })
      }

      return route.continue()
    })

    await page.goto('./login')
    expect(await page.title()).toEqual('Sign In / Sign Up | Inquire')

    await page.getByLabel(/email/i).fill(validMagicEmail)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.getByRole('button', { name: /sign in/i }).isHidden()
    await page.getByRole('button', { name: /authenticating/i }).isDisabled()

    await page.waitForURL(baseURL + '/queue')
    expect(page.url()).toEqual(baseURL + '/queue')

    await deleteUserProfileFromDatabaseById(user.id)
  })

  test('given user is logged out & invalid credentials are provided: should NOT crash the app and the user should be able to log in again with a valid email', async ({
    page,
    baseURL,
  }) => {
    const user = createPopulatedUserProfile()
    await saveUserProfileToDatabase(user)
    const cookieToken = await createValidCookieToken(user.id)

    await page.addInitScript(() => {
      window.runMagicInTestMode = true
    })

    await page.route(loginLoaderRoute, (route, request) => {
      const postData = request.postData()

      if (postData && postData.includes('didToken')) {
        return route.fulfill({
          headers: {
            'Set-Cookie': `${USER_AUTHENTICATION_SESSION_NAME}=${cookieToken}; Max-Age=31536000; Path=/; HttpOnly; SameSite=Lax`,
            'X-Remix-Redirect': '/queue',
            'X-Remix-Revalidate': 'yes',
          },
          status: 204,
        })
      }

      return route.continue()
    })

    await page.goto('./login')

    await page.getByLabel(/email/i).fill('not-an-email@foo')
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: /sign in/i }).isDisabled()
    await expect(page.getByText(new RegExp("A valid email consists of characters, '@' and '.'.", 'i'))).toBeVisible()

    await page.getByLabel(/email/i).fill(invalidMagicEmail)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/login failed. please try again/i)).toBeVisible()

    await page.getByLabel(/email/i).fill(validMagicEmail)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(baseURL + '/queue')
    await expect(page.getByRole('heading', { level: 1, name: /questions/i })).toBeVisible()
    const currentUrl = new URL(page.url())
    expect(currentUrl.origin + currentUrl.pathname).toEqual(baseURL + '/queue')

    await deleteUserProfileFromDatabaseById(user.id)
  })

  test('given user is logged out: page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('./login')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
