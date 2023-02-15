import { LoaderFunction, redirect } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  if (url.pathname === '/') return redirect('/queue')
  return null
}

export default function Index() {
  return <main></main>
}
