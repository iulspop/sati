import type { LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'

import { getUserId } from '~/features/user-authentication/user-authentication-session.server'
import { getSafeRedirectDestination } from '~/utils/get-safe-redirect-destination.server'

export const handle = { i18n: ['common', 'landing'] }

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request)

  if (userId) {
    const redirectTo = getSafeRedirectDestination(request, '/home')
    return redirect(redirectTo)
  }

  return json({})
}

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-12 bg-white p-10 dark:bg-slate-800">
      <h1>{t('landing:main-heading')}</h1>
      <p>{t('landing:hello')}</p>
      <Link
        to="/login"
        className="flex max-w-lg items-center justify-center rounded-md bg-indigo-600 px-4 py-3 font-medium text-white "
      >
        {t('landing:sign-in')}
      </Link>
    </main>
  )
}
