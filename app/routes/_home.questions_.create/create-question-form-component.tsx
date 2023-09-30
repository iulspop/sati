import { Link, useFetcher } from '@remix-run/react'

export type CreateQuestionFormEntries = {
  text: string
  timestamp: string
  utcOffsetInMinutes: string
}

export function CreateQuestionFormComponent() {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post" className="flex flex-col space-y-4 bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto dark:text-black">
      <label htmlFor="recurring-question" className="font-semibold text-lg">
        What recurring question to add?
      </label>

      <input
        id="recurring-question"
        name="text"
        type="text"
        className="border p-2 rounded dark:bg-gray-200 dark:border-gray-500 dark:text-black"
        required
      />

      <input type="hidden" name="timestamp" value={new Date().toISOString()} />
      <input type="hidden" name="utcOffsetInMinutes" value={new Date().getTimezoneOffset()} />

      <div className="flex justify-between items-center">
        <Link to="/questions" className="text-blue-600 hover:text-blue-700 underline">
          Cancel
        </Link>

        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
          Submit
        </button>
      </div>
    </fetcher.Form>
  )
}
