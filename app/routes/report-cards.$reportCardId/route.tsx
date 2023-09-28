import { recurringQuestionFactory } from '~/self-data-collection/domain/entities/recurring-question'
import type { AnswersGroupedByQuestion } from './last-week-answers-table-component'
import { LastWeekAnswersTableComponent } from './last-week-answers-table-component'

export default function Page() {
  const questionCreatedDate = new Date('2023-10-02T05:00:00Z')
  const currentDate = new Date('2023-10-20T05:00:00Z')

  const answersGroupedByQuestions: AnswersGroupedByQuestion[] = [
    {
      question: recurringQuestionFactory({
        text: 'Did you complete your morning 1h meditation?',
        timestamp: questionCreatedDate,
      }),
      answers: [],
    },
    {
      question: recurringQuestionFactory({
        text: 'Did you complete your noon 1h meditation?',
        timestamp: questionCreatedDate,
      }),
      answers: [],
    },
    {
      question: recurringQuestionFactory({
        text: 'Did you complete your evening 1h meditation?',
        timestamp: questionCreatedDate,
      }),
      answers: [],
    },
  ]

  return (
    <LastWeekAnswersTableComponent answersGroupedByQuestions={answersGroupedByQuestions} currentDate={currentDate} />
  )
}
