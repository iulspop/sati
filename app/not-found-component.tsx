import { Link } from '@remix-run/react'

export function NotFoundComponent() {
  return (
    <div className="flex min-h-full flex-col bg-white pb-12 pt-16 dark:bg-slate-800">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <Link to="/" className="inline-flex">
            <span className="sr-only">Inquire</span>
            <img className="h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600" alt="" />
          </Link>
        </div>

        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-200">404 Error</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Page not found.</h1>

            <p className="mt-2 text-base text-gray-500 dark:text-slate-400">Sorry, we couldn't find the page you're looking for.</p>

            <div className="mt-6">
              <Link to={'/'} className="text-base font-medium text-indigo-600 hover:text-indigo-400 dark:text-indigo-200 dark:hover:text-indigo-300">
                Go back home
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
