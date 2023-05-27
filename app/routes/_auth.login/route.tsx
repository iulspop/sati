import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useNavigation, useSubmit } from '@remix-run/react'
import { Magic } from 'magic-sdk'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import {
  retrieveUserProfileFromDatabaseById,
  saveUserProfileToDatabase,
} from '~/domains/self-data-collection/infrastructure/user-profile-model.server'
import { useEffectOnce } from '~/hooks/use-effect-once'
import { usePromise } from '~/hooks/use-promise'
import { UserAuthenticationComponent, loginIntent } from '~/routes/_auth.login/user-authentication-component'
import { magicAdmin } from '~/routes/_auth/magic-admin.server'
import { createUserSession, getUserId } from '~/routes/_auth/user-authentication-session.server'
import { getSafeRedirectDestination } from '~/utils/get-safe-redirect-destination.server'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request)

  if (userId) {
    const redirectTo = getSafeRedirectDestination(request, '/queue')
    return redirect(redirectTo)
  }

  return new Response(null, { status: 200 })
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Sign In / Sign Up | Inquire' }]

type ActionData = {
  email?: string
  emailError?: string
  formError?: string
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

const magicIntent = 'magic'
const magicErrorIntent = 'magicError'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const { _intent, ...values } = Object.fromEntries(formData)

  if (_intent === loginIntent) {
    const { email } = values
    const emailSchema = z
      .string({
        required_error: 'Please enter a valid email (required).',
        invalid_type_error: 'A valid email address must be string.',
      })
      .email({ message: "A valid email consists of characters, '@' and '.'." })

    const result = emailSchema.safeParse(email)

    if (result.success === false) {
      return badRequest({ emailError: result.error.issues[0].message })
    }

    return json<ActionData>({ email: result.data })
  }

  if (_intent === magicIntent) {
    const { didToken } = values

    if (typeof didToken !== 'string') {
      return badRequest({
        formError: 'A DID token must be string.',
      })
    }

    const { email, issuer: userId } = await magicAdmin.users.getMetadataByToken(didToken)

    if (typeof userId !== 'string') {
      return badRequest({
        formError: 'Missing issuer from Magic metadata.',
      })
    }

    const existingUser = await retrieveUserProfileFromDatabaseById(userId)

    if (!existingUser) {
      if (typeof email !== 'string') {
        return json({ errorMessage: 'Missing email from Magic metadata.' }, { status: 400 })
      }

      await saveUserProfileToDatabase({ id: userId, email })
    }

    const redirectTo = getSafeRedirectDestination(request, '/queue')

    return createUserSession({ redirectTo, remember: true, request, userId })
  }

  if (_intent === magicErrorIntent) {
    const { formError } = values

    if (typeof formError !== 'string') {
      return badRequest({ formError: 'Invalid Magic error.' })
    }

    return badRequest({ formError })
  }

  return badRequest({
    formError: `Invalid intent: ${_intent}`,
  })
}

export default function LoginPage() {
  const data = useActionData<ActionData>()
  const navigation = useNavigation()
  const state: 'idle' | 'error' | 'submitting' =
    navigation.state === 'submitting' || data?.email
      ? 'submitting'
      : data?.emailError || data?.formError
      ? 'error'
      : 'idle'

  const inputRef = useRef<HTMLInputElement>(null)
  const mounted = useRef<boolean>(false)

  useEffect(() => {
    if (state === 'error') {
      inputRef.current?.focus()
    }

    if (state === 'idle' && mounted.current) {
      inputRef.current?.select()
    }

    mounted.current = true
  }, [state])

  const [magicReady, setMagicReady] = usePromise<{ magic: Magic }>()
  const submit = useSubmit()

  useEffectOnce(() => {
    async function downloadMagicStaticAssets() {
      const magic = new Magic(window.ENV.MAGIC_PUBLISHABLE_KEY, {
        /**
         * @see https://magic.link/docs/introduction/test-mode
         */
        testMode: window.runMagicInTestMode,
      })
      await magic.preload()
      setMagicReady({ magic })
    }

    downloadMagicStaticAssets().catch(() => {
      submit(
        {
          _intent: magicErrorIntent,
          formError: 'Failed to load authentication provider https://magic.link. Please reload the page to try again.',
        },
        { method: 'post', replace: true }
      )
    })
  })

  useEffect(() => {
    if (typeof data?.email === 'string' && data?.email.length > 0) {
      async function loginWithMagic() {
        try {
          const { magic } = await magicReady
          const didToken = await magic.auth.loginWithMagicLink({
            email: data!.email!,
          })

          if (didToken) {
            submit({ didToken, _intent: magicIntent }, { method: 'post', replace: true })
          } else {
            submit(
              {
                _intent: magicErrorIntent,
                formError: 'Login failed. No DID token.',
              },
              { method: 'post', replace: true }
            )
          }
        } catch {
          submit(
            {
              _intent: magicErrorIntent,
              formError: 'Login failed. Please try again.',
            },
            { method: 'post', replace: true }
          )
        }
      }

      loginWithMagic()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.email])

  return (
    <UserAuthenticationComponent
      email={data?.email}
      emailError={data?.emailError}
      formError={data?.formError}
      inputRef={inputRef}
      state={state}
    />
  )
}
