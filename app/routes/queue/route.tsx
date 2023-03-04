import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { i18next } from '~/features/localization/i18next.server'
import { requireUserIsAuthenticated } from '~/features/user-authentication/user-authentication-session.server'
import { HomePageComponent } from '~/routes/queue/home-page-component'
import { getPageTitle } from '~/utils/get-page-title.server'

export const handle = { i18n: 'home' }

export const loader = async ({ request }: LoaderArgs) => {
  const [t] = await Promise.all([i18next.getFixedT(request), requireUserIsAuthenticated(request)])

  return json({
    title: await getPageTitle(request, t('home:title') ?? undefined),
    navigation: [{ name: t('home:question-queue'), href: '#', current: true }],
  })
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }]

export default function HomePage() {
  const { navigation } = useLoaderData<typeof loader>()

  return (
    <HomePageComponent
      // @ts-ignore
      navigation={navigation}
    />
  )
}
