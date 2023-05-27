import { Link, useFetcher } from '@remix-run/react'

export function CreateQuestionFormComponent() {
  const fetcher = useFetcher()

  const timestamp = new Date().toISOString()
  const utcOffsetInMinutes = new Date().getTimezoneOffset()

  return (
    <fetcher.Form method="post">
      <label htmlFor="recurring-question">What is the recurring question?</label>
      <input id="recurring-question" name="text" type="text" required />
      <input type="hidden" name="timestamp" value={timestamp} />
      <input type="hidden" name="utcOffsetInMinutes" value={utcOffsetInMinutes} />
      <Link to="/questions">Cancel</Link>
      <button type="submit">Submit</button>
    </fetcher.Form>
  )
}
