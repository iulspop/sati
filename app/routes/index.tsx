import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { PromptQueue } from '~/domains/self-data-collection/domain'

export const loader = async () => json(await PromptQueue.query())

export default function Index() {
  const prompts = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>Inquire</h1>
      <h2>Questions</h2>
      <ul>
        {groupByTimestamp(prompts).map(([timestamp, prompts]) => (
          <li key={timestamp}>
            <h3>{new Date(timestamp).toISOString()}</h3>
            <ul>
              {prompts.map(prompt => (
                <li key={prompt.timestamp + prompt.questionId}>
                  <h3>{prompt.question}</h3>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}

const groupByTimestamp = prompts => [
  ...prompts
    .reduce(
      (timestamps, prompt) => timestamps.set(prompt.timestamp, (timestamps.get(prompt.timestamp) || []).concat(prompt)),
      new Map()
    )
    .entries(),
]
