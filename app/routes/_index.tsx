import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { getUserId } from '~/routes/_auth/user-authentication-session.server'
import { getSafeRedirectDestination } from '~/utils/get-safe-redirect-destination.server'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request)

  if (userId) {
    const redirectTo = getSafeRedirectDestination(request, '/queue')
    return redirect(redirectTo)
  }

  return new Response(null, { status: 200 })
}

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-12 bg-white p-10 dark:bg-slate-800">
      <h1 className="dark:text-white">Sati</h1>
      <Link to="/login" className="flex max-w-lg items-center justify-center rounded-md bg-indigo-600 px-4 py-3 font-medium text-white">
        Log In
      </Link>
    </main>
  )
}
