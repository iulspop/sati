import { Link, useFetcher } from '@remix-run/react'
import type { RecurringQuestion } from '~/self-inquiry/domain/entities/recurring-question'

export type EditQuestionFormComponentProps = RecurringQuestion

export type DeleteQuestionFormEntries = {
  questionId: string
}

export function EditQuestionFormComponent({ id, text }: EditQuestionFormComponentProps) {
  const fetcher = useFetcher()

  return (
    <div className="flex flex-col space-y-4 bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto dark:text-black">
      <h2 className="font-semibold text-lg">Edit Question:</h2>
      <p className="border p-2 rounded dark:bg-gray-200 dark:border-gray-500 dark:text-black">{text}</p>

      <div className="flex justify-between items-center">
        <Link to="/questions" className="text-blue-600 hover:text-blue-700 underline">
          Cancel
        </Link>

        <fetcher.Form method="delete" className="flex">
          <input type="hidden" name="questionId" value={id} />
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            Delete
          </button>
        </fetcher.Form>
      </div>
    </div>
  )
}
