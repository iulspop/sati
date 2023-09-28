import { recurringQuestionFactory } from '~/self-data-collection/domain/entities/recurring-question'
import type { AnswersGroupedByQuestion } from './last-week-answers-table-component'
import { LastWeekAnswersTableComponent } from './last-week-answers-table-component'

export default function Page() {
  const answersGroupedByQuestions: AnswersGroupedByQuestion[] = [
    {
      question: recurringQuestionFactory({
        text: 'Did you complete your morning 1h meditation?',
      }),
      answers: [],
    },
    {
      question: recurringQuestionFactory({
        text: 'Did you complete your noon 1h meditation?',
      }),
      answers: [],
    },
    {
      question: recurringQuestionFactory({
        text: 'Did you complete your evening 1h meditation?',
      }),
      answers: [],
    },
  ]

  return (
    <LastWeekAnswersTableComponent
      answersGroupedByQuestions={answersGroupedByQuestions}
      currentDate={new Date('2023-10-02T05:00:00Z')}
    />
  )
}
