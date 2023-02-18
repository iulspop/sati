import type { ActionArgs, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react'

import { Prompt } from '~/components/prompt-component'
import { Answers, PromptQueue } from '~/domains/self-data-collection/domain'

export const loader: LoaderFunction = async () => {
  const prompts = await PromptQueue.query()
  return json(prompts)
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const { questionId, response, timestamp } = Object.fromEntries(formData.entries())

  // @ts-ignore
  return await Answers.create({ questionId, response: response === 'true', timestamp: new Date(timestamp) })
}

export default function Index() {
  const prompts = useLoaderData<typeof loader>()
  const location = useLocation()

  return (
    <main>
      <Link to={'/'}>
        <h1>Inquire</h1>
      </Link>
      <h2>Questions</h2>
      <Link to={location.pathname === '/queue/edit' ? '' : 'edit'}>edit</Link>
      <Outlet />
      <ul>
        {groupByTimestamp(prompts).map(([timestamp, prompts]) => (
          <li key={timestamp}>
            <h3>{new Date(timestamp).toISOString()}</h3>
            <ul>
              {
                // @ts-ignore
                prompts.map(prompt => (
                  <Prompt key={prompt.timestamp + prompt.questionId} {...prompt} />
                ))
              }
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}

const groupByTimestamp = prompts =>
  Object.entries(
    prompts.reduce((timestamps, prompt) => {
      if (!timestamps[prompt.timestamp]) timestamps[prompt.timestamp] = []
      timestamps[prompt.timestamp] = [...timestamps[prompt.timestamp], prompt]
      return timestamps
    }, {})
  )
