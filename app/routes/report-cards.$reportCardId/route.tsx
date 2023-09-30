import { answerFactory } from '~/self-inquiry/domain/entities/answer'
import { recurringQuestionFactory } from '~/self-inquiry/domain/entities/recurring-question'
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

  return (
    <div className="p-8 bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Iuliu's Meditation Practice</h1>
      <p className="text-xl mb-4">How's my meditation practice going?</p>
      <h2 className="text-2xl text-green-500 my-2">2 Week Streak Out Of 104 Week Goal</h2>
      <p className="text-lg mb-6">Number of weeks Iuliu meditated on average two one hour sessions over the week.</p>
      <LastWeekAnswersTableComponent answersGroupedByQuestions={answersGroupedByQuestions} currentDate={octoberTenthDate} timeZone="Etc/UTC" />
    </div>
  )
}

const addDays = (days: number) => (date: Date) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
