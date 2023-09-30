import { answerFactory } from '~/self-data-collection/domain/entities/answer'
import { recurringQuestionFactory } from '~/self-data-collection/domain/entities/recurring-question'
import type { AnswersGroupedByQuestion } from './last-week-answers-table-component'
import { LastWeekAnswersTableComponent } from './last-week-answers-table-component'

export default function Page() {
  const octoberSecondDate = new Date('2023-10-02T00:00:00Z')
  const octoberFourthDate = new Date('2023-10-04T00:00:00Z')

  const questionsCreatedDate = octoberSecondDate
  const currentDate = octoberFourthDate

  const firstQuestion = recurringQuestionFactory({
    text: 'Did you complete your morning 1h meditation?',
    timestamp: questionsCreatedDate,
  })
  const secondQuestion = recurringQuestionFactory({
    text: 'Did you complete your noon 1h meditation?',
    timestamp: questionsCreatedDate,
  })
  const thirdQuestion = recurringQuestionFactory({
    text: 'Did you complete your evening 1h meditation?',
    timestamp: questionsCreatedDate,
  })

  const answersGroupedByQuestions: AnswersGroupedByQuestion[] = [
    {
      question: firstQuestion,
      answers: [answerFactory({ questionId: firstQuestion.id, response: true, timestamp: octoberSecondDate })],
    },
    {
      question: secondQuestion,
      answers: [answerFactory({ questionId: secondQuestion.id, response: false, timestamp: octoberSecondDate })],
    },
    {
      question: thirdQuestion,
      answers: [],
    },
  ]

  return <LastWeekAnswersTableComponent answersGroupedByQuestions={answersGroupedByQuestions} currentDate={currentDate} timeZone="Etc/UTC" />
}
