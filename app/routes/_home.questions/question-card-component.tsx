import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'

export type PromptCardComponentProps = RecurringQuestion

export function QuestionCardComponent({ text }: PromptCardComponentProps) {
  return (
    <li className="bg-white shadow-md rounded-md p-4 my-2 hover:bg-gray-100 dark:text-black">
      <p className="text-lg font-semibold">{text}</p>
    </li>
  )
}
