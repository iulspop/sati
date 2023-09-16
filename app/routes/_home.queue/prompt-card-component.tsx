import { useFetcher } from '@remix-run/react'

export type PromptCardComponentProps = {
  questionId: string
  question: string
  timestamp: Date
}

export type PromptCardComponentFormEntries = {
  questionId: string
  response: 'Yes' | 'No'
  timestamp: string
}

export function PromptCardComponent({ questionId, question, timestamp }: PromptCardComponentProps) {
  const fetcher = useFetcher()

  return (
    <li className="my-6">
      <fetcher.Form method="post">
        <p className="my-4">{question}</p>
        <input type="hidden" name="questionId" value={questionId} />
        <input type="hidden" name="timestamp" value={timestamp.toISOString()} />
        <button
          className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          name="response"
          value="Yes"
          type="submit"
          aria-label={`Answer "${question}" with Yes`}
        >
          Yes
        </button>
        <button
          className="ml-4 rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
          name="response"
          value="No"
          type="submit"
          aria-label={`Answer "${question}" with No`}
        >
          No
        </button>
      </fetcher.Form>
    </li>
  )
}
