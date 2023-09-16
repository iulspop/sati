import { Link, useFetcher } from '@remix-run/react'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'

export type EditQuestionFormComponentProps = RecurringQuestion

export type DeleteQuestionFormEntries = {
  questionId: string
}

export function EditQuestionFormComponent({ id, question }: EditQuestionFormComponentProps) {
  const fetcher = useFetcher()

  return (
    <div>
      <h2>Edit Question:</h2>
      <p>{question}</p>
      <div>
        <Link to="/questions">Cancel</Link>
        <fetcher.Form method="delete">
          <input type="hidden" name="questionId" value={id} />
          <button type="submit">Delete</button>
        </fetcher.Form>
      </div>
    </div>
  )
}
