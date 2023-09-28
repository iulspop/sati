import type { Answer } from '~/self-data-collection/domain/entities/answer'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'

export type AnswersGroupedByQuestion = {
  question: RecurringQuestion
  answers: Answer[]
}

export type LastWeekAnswersTableComponentProps = {
  answersGroupedByQuestions: AnswersGroupedByQuestion[]
  currentDate?: Date
  timeZone?: string
}

export function LastWeekAnswersTableComponent({
  answersGroupedByQuestions,
  currentDate = new Date(),
  timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone,
}: LastWeekAnswersTableComponentProps) {
  const lastEightDaysColumnsHeadersText = [...getPreviousSevenDays(currentDate), currentDate].map(date =>
    formatDateToTwoDigitMonthAndDay(date, timeZone)
  )
  const questionsCreatedDate = answersGroupedByQuestions[0].question.timestamp
  const daysSinceStartCount = getDifferenceInDays(questionsCreatedDate, currentDate)
  const daysSinceStartList = getDaysBetweenDates(questionsCreatedDate, currentDate)
  const notTrackedHeaderColSpan = 7 - daysSinceStartCount

  return (
    <table className="dark:text-white w-full max-w-screen-xl border-collapse bg-slate-400 m-6 border">
      <caption>Last Week's Meditation Tracking</caption>
      <thead>
        <tr>
          <th scope="row">Days Since Start:</th>
          {notTrackedHeaderColSpan >= 1 && (
            <th scope="column" colSpan={notTrackedHeaderColSpan}>
              Not Tracked
            </th>
          )}
          {daysSinceStartList.map(day => (
            <th key={day} scope="column">
              {day}
            </th>
          ))}
        </tr>
        <tr>
          <th scope="row" aria-label="Empty header for spacing" />
          {lastEightDaysColumnsHeadersText.map(columnHeaderText => (
            <th key={columnHeaderText} scope="column">
              {columnHeaderText}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {answersGroupedByQuestions.map(({ question }) => (
          <QuestionAnswersRow key={question.id} questionText={question.text} />
        ))}
      </tbody>
    </table>
  )
}

const QuestionAnswersRow = ({ questionText }) => (
  <tr>
    <th scope="row">{questionText}</th>
    <UntrackedCell />
    <UntrackedCell />
    <UntrackedCell />
    <UntrackedCell />
    <UntrackedCell />
    <UntrackedCell />
    <UntrackedCell />
    <UnansweredCell />
  </tr>
)

const UntrackedCell = () => <td className="border bg-black" aria-label="Untracked data" />

const UnansweredCell = () => (
  <td className="border bg-gray-200 text-center text-gray-500 border-gray-500" aria-label="Unanswered">
    ?
  </td>
)

export const getPreviousSevenDays = (date: Date): Date[] =>
  Array.from({ length: 7 })
    .map((_, idx) => {
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate() - idx - 1)
      return newDate
    })
    .reverse()

export const formatDateToTwoDigitMonthAndDay = (date: Date, timeZone: string): string =>
  date.toLocaleDateString('en-US', { timeZone, month: '2-digit', day: '2-digit' })

export const getDifferenceInDays = (beforeDate: Date, afterDate: Date): number => {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((beforeDate.getTime() - afterDate.getTime()) / oneDayInMilliseconds))
}

export const getDaysBetweenDates = (beforeDate: Date, afterDate: Date): number[] => {
  const daysSince = getDifferenceInDays(beforeDate, afterDate) + 1 // Count starts at 1
  return Array.from({ length: Math.min(8, daysSince) })
    .map((_, index) => daysSince - index)
    .reverse()
}
