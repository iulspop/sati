import { Link, useFetcher } from '@remix-run/react'

export type CreateQuestionFormEntries = {
  text: string
  timestamp: string
  utcOffsetInMinutes: string
}

export function CreateQuestionFormComponent() {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post">
      <label htmlFor="recurring-question">What is the recurring question?</label>
      <input id="recurring-question" name="text" type="text" className="dark:text-black" required />
      <input type="hidden" name="timestamp" value={new Date().toISOString()} />
      <input type="hidden" name="utcOffsetInMinutes" value={new Date().getTimezoneOffset()} />
      <Link to="/questions">Cancel</Link>
      <button type="submit">Submit</button>
    </fetcher.Form>
  )
}
