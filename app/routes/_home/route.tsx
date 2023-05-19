import { Outlet } from '@remix-run/react'
import { HomePageComponent } from './home-page-component'

export default function HomePage() {
  return (
    <HomePageComponent
      navigation={[
        { name: 'Prompt Queue', href: '/queue' },
        { name: 'Recurring Questions', href: '/questions' },
      ]}
    >
      <Outlet />
    </HomePageComponent>
  )
}
