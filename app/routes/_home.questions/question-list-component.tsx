import type { RecurringQuestion } from '~/self-inquiry/domain/entities/recurring-question'
import { QuestionCardComponent } from './question-card-component'

export type QuestionListComponentProps = {
  questions: RecurringQuestion[]
}

export function QuestionListComponent({ questions }: QuestionListComponentProps) {
  return (
    <ul>
      {questions.map(question => (
        <QuestionCardComponent key={question.id} {...question} />
      ))}
    </ul>
  )
}
