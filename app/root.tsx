import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { LinksFunction, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react'
import invariant from 'tiny-invariant'
import type { EnvironmentVariables } from './entry.client'
import { NotFoundComponent } from './not-found-component'
import styles from './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
]

type LoaderData = {
  ENV: EnvironmentVariables
}

export const loader = async (_: LoaderArgs) => {
  const { MAGIC_PUBLISHABLE_KEY } = process.env
  invariant(MAGIC_PUBLISHABLE_KEY, 'MAGIC_PUBLISHABLE_KEY must be set')

  return json<LoaderData>({
    ENV: { MAGIC_PUBLISHABLE_KEY },
  })
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Inquire' }]

export default function App() {
  const { ENV } = useLoaderData<typeof loader>()

  return (
    <html lang="en" className="dark h-full overflow-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-auto bg-gray-100 dark:bg-slate-800">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const location = useLocation()
  const error = useRouteError()

  return isRouteErrorResponse(error) ? (
    <html className="dark h-full overflow-hidden" lang="en">
      <head>
        <title>404 Not Found | Inquire</title>
        <Meta />
        <Links />
      </head>

      <body className="h-full overflow-auto bg-gray-100 dark:bg-slate-800">
        <NotFoundComponent />
        <Scripts />
      </body>
    </html>
  ) : (
    <html className="dark h-full overflow-hidden">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-auto bg-gray-100 dark:bg-slate-800">
        <main className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>

                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h1 className="text-lg font-medium leading-6 text-gray-900">Ooops! 😱</h1>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        An unknown error occurred. We've automatically reported the error and we will investigate it{' '}
                        <i>
                          <b>asap</b>
                        </i>
                        ! 🤓
                      </p>
                      <p className="mt-2 text-sm text-gray-500">We're very sorry about this! 🙏 Please reload the page. 👇</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Link
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  to={location.pathname + location.search}
                >
                  Reload Page
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Scripts />
      </body>
    </html>
  )
}
