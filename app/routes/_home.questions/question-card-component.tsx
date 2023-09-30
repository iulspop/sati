import { Link } from '@remix-run/react'
import type { RecurringQuestion } from '~/self-inquiry/domain/entities/recurring-question'

export type PromptCardComponentProps = RecurringQuestion

export function QuestionCardComponent({ id, text }: PromptCardComponentProps) {
  return (
    <Link to={`/questions/${id}`}>
      <li className="bg-white shadow-md rounded-md p-4 my-2 hover:bg-gray-100 dark:text-black">
        <p className="text-lg font-semibold">{text}</p>
      </li>
    </Link>
  )
}
