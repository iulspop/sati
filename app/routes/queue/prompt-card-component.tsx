import { useFetcher } from '@remix-run/react'

export type PromptCardComponentProps = {
  questionId: string
  question: string
  timestamp: Date
}

export function PromptCardComponent({ questionId, question, timestamp }: PromptCardComponentProps) {
  const fetcher = useFetcher()

  return (
    <li key={question}>
      <fetcher.Form method="post">
        <p>{question}</p>
        <input type="hidden" name="questionId" value={questionId} />
        <input type="hidden" name="timestamp" value={timestamp.toISOString()} />
        <button name="answer" value="Yes" type="submit" aria-label={`Answer "${question}" with Yes`}>
          Yes
        </button>
        <button name="answer" value="No" type="submit" aria-label={`Answer "${question}" with No`}>
          No
        </button>
      </fetcher.Form>
    </li>
  )
}
