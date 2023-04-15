import { json, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Answers, PromptQueue } from '~/domains/self-data-collection/domain/index.server'
import type { Prompt } from '~/domains/self-data-collection/domain/value-objects/prompt'
import { requireUserIsAuthenticated } from '~/features/user-authentication/user-authentication-session.server'
import { HomePageComponent } from '~/routes/queue/home-page-component'
import { convertAnswerFormat } from './convert-answer-format'
import { PromptCardComponentFormEntries } from './prompt-card-component'
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

export default function HomePage() {
  const promptList = useLoaderData<typeof loader>().map(serializedPrompt => ({
    ...serializedPrompt,
    timestamp: new Date(serializedPrompt.timestamp),
  })) as Prompt[]

  return (
    <HomePageComponent navigation={[{ name: 'Question Queue', href: '#', current: true }]}>
      <PromptListComponent promptList={promptList} />
    </HomePageComponent>
  )
}
