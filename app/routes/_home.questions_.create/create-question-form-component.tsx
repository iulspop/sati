import { useFetcher } from '@remix-run/react'

export function CreateQuestionFormComponent() {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post">
      <label htmlFor="recurring-question">What is the recurring question?</label>
      <input id="recurring-question" name="text" type="text" required />
      <button type="submit">Submit</button>
    </fetcher.Form>
  )
}
