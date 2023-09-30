import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import { useEffect } from 'react'
import { requireUserIsAuthenticated } from '~/routes/_auth/user-authentication-session.server'
import { answersService, promptQueueService } from '~/self-inquiry/domain/index.server'
import { PromptSchema } from '~/self-inquiry/domain/value-objects/prompt'
import { convertAnswerFormat } from './convert-answer-format'
import type { PromptCardComponentFormEntries } from './prompt-card-component'
import { PromptListComponent } from './prompt-list-component'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserIsAuthenticated(request)
  const promptList = await promptQueueService.query(userId)
  return json(promptList)
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Home | Inquire' }]

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  // @ts-expect-error
  const answer: PromptCardComponentFormEntries = Object.fromEntries(formData.entries())
  await answersService.create(convertAnswerFormat(answer))
  return new Response(null, { status: 200 })
}

export default function QueuePage() {
  const promptList = useLoaderData<typeof loader>().map(serializedPrompt => PromptSchema.parse(serializedPrompt))

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const timeZone = searchParams.get('timeZone')

  useEffect(() => {
    if (timeZone) return

    const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const newPath = `${location.pathname}?timeZone=${encodeURIComponent(clientTimeZone)}`
    window.history.replaceState({}, '', newPath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone])

  // @ts-expect-error
  return <PromptListComponent promptList={promptList} timeZone={timeZone} />
}
