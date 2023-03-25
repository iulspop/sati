import { RemixBrowser } from '@remix-run/react'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

export type EnvironmentVariables = {
  MAGIC_PUBLISHABLE_KEY: string
}
declare global {
  var ENV: EnvironmentVariables

  interface Window {
    runMagicInTestMode?: boolean
  }
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})
