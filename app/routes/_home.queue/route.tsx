import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import { useEffect } from 'react'
import { Answers, PromptQueue } from '~/domains/self-data-collection/domain/index.server'
import type { Prompt } from '~/domains/self-data-collection/domain/value-objects/prompt'
import { requireUserIsAuthenticated } from '~/features/user-authentication/user-authentication-session.server'
import { convertAnswerFormat } from './convert-answer-format'
import type { PromptCardComponentFormEntries } from './prompt-card-component'
import { PromptListComponent } from './prompt-list-component'

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserIsAuthenticated(request)
  const promptList = await PromptQueue.query()
  return json(promptList)
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Home | Inquire' }]

export const action = async ({ request }) => {
  const formData = await request.formData()
  // @ts-expect-error
  const answer: PromptCardComponentFormEntries = Object.fromEntries(formData.entries())
  await Answers.create(convertAnswerFormat(answer))
  return new Response(null, { status: 200 })
}

export default function QueuePage() {
  const promptList = useLoaderData<typeof loader>().map(serializedPrompt => ({
    ...serializedPrompt,
    timestamp: new Date(serializedPrompt.timestamp),
  })) as Prompt[]

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

  return <PromptListComponent promptList={promptList} timeZone={timeZone} />
}
