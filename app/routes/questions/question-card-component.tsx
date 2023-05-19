import type { RecurringQuestion } from '~/domains/self-data-collection/domain/entities/recurring-question'

export type PromptCardComponentProps = {
  question: RecurringQuestion
}

export function QuestionCardComponent({ question }: PromptCardComponentProps) {
  return (
    <li>
      <p>{question.question}</p>
    </li>
  )
}
