import { Link, Outlet, useLocation } from '@remix-run/react'
import { classNames } from '~/utils/class-names'

export default function HomePage() {
  const { pathname: path } = useLocation()

  return (
    <>
      <nav className="mx-auto flex h-10 items-center justify-between bg-gray-800 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              alt="Inquire"
            />
          </div>
          <div className="ml-10 flex items-baseline space-x-4">
            {[
              { name: 'Prompt Queue', href: '/queue' },
              { name: 'Recurring Questions', href: '/questions' },
            ].map(({ name, href }) => {
              const isCurrent = calculateIfLinkIsCurrent({ path, href })

              return (
                <Link
                  key={name}
                  to={href}
                  className={classNames(
                    isCurrent ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-1 py-2 text-sm font-medium'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </div>
        <form action="/logout" method="post" className="">
          <button
            type="submit"
            className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Log out
          </button>
        </form>
      </nav>

      <header className="bg-white shadow dark:bg-slate-800 mb-5">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Questions</h1>
        </div>
      </header>

      <main className="flex flex-col items-center dark:text-white lg:max-w-3xl mx-auto">
        <Outlet />
      </main>
    </>
  )
}

export const calculateIfLinkIsCurrent = ({ path, href }: { path: string; href: string }): boolean => {
  if (path === href) return true
  if (href.startsWith(path) && href.charAt(path.length) === '/') return true
  return false
}
