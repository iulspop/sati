import { answerFactory } from '~/self-data-collection/domain/entities/answer'
import { recurringQuestionFactory } from '~/self-data-collection/domain/entities/recurring-question'
import type { AnswersGroupedByQuestion } from './last-week-answers-table-component'
import { LastWeekAnswersTableComponent } from './last-week-answers-table-component'

export default function Page() {
  const octoberSecondDate = new Date('2023-10-02T00:00:00Z')
  const octoberTenthDate = new Date('2023-10-10T00:00:00Z')

  const firstQuestion = recurringQuestionFactory({
    text: 'Did you complete your morning 1h meditation?',
    timestamp: octoberSecondDate,
  })

  const answersGroupedByQuestions: AnswersGroupedByQuestion[] = [
    {
      question: firstQuestion,
      answers: [
        answerFactory({ questionId: firstQuestion.id, response: false, timestamp: octoberSecondDate }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(1)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(2)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(3)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(4)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(5)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(6)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: true, timestamp: addDays(7)(octoberSecondDate) }),
        answerFactory({ questionId: firstQuestion.id, response: false, timestamp: addDays(8)(octoberSecondDate) }),
      ],
    },
  ]

  return <LastWeekAnswersTableComponent answersGroupedByQuestions={answersGroupedByQuestions} currentDate={octoberTenthDate} timeZone="Etc/UTC" />
}

const addDays = (days: number) => (date: Date) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
