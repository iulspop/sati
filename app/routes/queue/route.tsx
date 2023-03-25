import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'

import { requireUserIsAuthenticated } from '~/features/user-authentication/user-authentication-session.server'
import { HomePageComponent } from '~/routes/queue/home-page-component'

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserIsAuthenticated(request)
  return new Response('', {
    status: 200,
  })
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Home | Inquire' }]

export default function HomePage() {
  return <HomePageComponent navigation={[{ name: 'Question Queue', href: '#', current: true }]} />
}
