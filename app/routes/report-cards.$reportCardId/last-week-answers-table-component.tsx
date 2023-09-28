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
  const lastSevenDaysColumnsHeadersText = getPreviousSevenDays(currentDate).map(date =>
    formatDateToTwoDigitMonthAndDay(date, timeZone)
  )

  return (
    <table className="dark:text-white w-full max-w-screen-xl border-collapse bg-slate-400 m-6 border">
      <caption>Last Week's Meditation Tracking</caption>
      <thead>
        <tr>
          <th scope="row">Days Since Start:</th>
          <th scope="column" colSpan={7}>
            Not Tracked
          </th>
          <th scope="column">1</th>
        </tr>
        <tr>
          <th scope="row" aria-label="Empty header for spacing"></th>
          {lastSevenDaysColumnsHeadersText.map(columnHeaderText => (
            <th key={columnHeaderText} scope="column">
              {columnHeaderText}
            </th>
          ))}
          <th scope="column">{formatDateToTwoDigitMonthAndDay(currentDate, timeZone)}</th>
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

const QuestionAnswersRow = ({ questionText }) => {
  return (
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
}

const UntrackedCell = () => {
  return <td className="border bg-black" aria-label="Untracked data"></td>
}

const UnansweredCell = () => {
  return (
    <td className="border bg-gray-200 text-center text-gray-500 border-gray-500" aria-label="Unanswered">
      ?
    </td>
  )
}

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
