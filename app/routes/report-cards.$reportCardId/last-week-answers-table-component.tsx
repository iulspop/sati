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
  const questionsCreatedDate = answersGroupedByQuestions[0].question.timestamp
  const daysSinceStartCount = getDifferenceInDays(questionsCreatedDate, currentDate)
  const daysSinceStartList = getDaysBetweenDates(questionsCreatedDate, currentDate)
  const notTrackedHeaderColSpan = 7 - daysSinceStartCount
  const lastEightDaysColumnsHeadersText = [...getPreviousSevenDays(currentDate), currentDate].map(date =>
    formatDateToTwoDigitMonthAndDay(date, timeZone)
  )

  return (
    <table className="dark:text-white w-full max-w-screen-xl border-collapse bg-slate-400 m-6 border">
      <caption>Last Week's Meditation Tracking</caption>
      <thead>
        <tr>
          <th scope="row">Days Since Start:</th>
          {notTrackedHeaderColSpan >= 1 && <NotTrackedColumnHeader colSpan={notTrackedHeaderColSpan} />}
          {daysSinceStartList.map(day => (
            <DaySinceStartCountColumnHeader key={day} day={day} />
          ))}
        </tr>
        <tr>
          <th scope="row" aria-label="Empty header for spacing" />
          {lastEightDaysColumnsHeadersText.map(text => (
            <DateColumnHeader key={text} text={text} />
          ))}
        </tr>
      </thead>
      <tbody>
        {answersGroupedByQuestions.map(({ question, answers }) => (
          <QuestionAnswersRow
            key={question.id}
            question={question}
            answers={answers}
            questionsCreatedDate={questionsCreatedDate}
            currentDate={currentDate}
          />
        ))}
      </tbody>
    </table>
  )
}

const NotTrackedColumnHeader = ({ colSpan }) => (
  <th scope="column" colSpan={colSpan}>
    Not Tracked
  </th>
)

const DaySinceStartCountColumnHeader = ({ day }) => <th scope="column">{day}</th>

const DateColumnHeader = ({ text }) => (
  <th key={text} scope="column">
    {text}
  </th>
)

const QuestionAnswersRow = ({ question, answers, questionsCreatedDate, currentDate }) => {
  return (
    <tr>
      <th scope="row">{question.text}</th>
      {calculatePreviousSevenDaysAnswers(answers, questionsCreatedDate, currentDate).map(functionalComponent =>
        functionalComponent()
      )}
      <UnansweredCell />
    </tr>
  )
}

export const UntrackedCell = () => <td className="border bg-black" aria-label="Untracked data" />

export const YesAnswerCell = () => <td className="border bg-lime-400" aria-label="Yes" />

export const NoAnswerCell = () => <td className="border bg-white" aria-label="No" />

export const UnansweredCell = () => (
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

type CalculatePreviousSevenDaysAnswers = (
  answers: Answer[],
  questionCreatedDate: Date,
  currentDate: Date
) => (typeof UntrackedCell | typeof YesAnswerCell | typeof NoAnswerCell | typeof UnansweredCell)[]
export const calculatePreviousSevenDaysAnswers: CalculatePreviousSevenDaysAnswers = (
  answers,
  questionCreatedDate,
  currentDate
) =>
  getPreviousSevenDays(currentDate).map(day => {
    if (isPreviousDayOrBefore(day, questionCreatedDate)) return UntrackedCell
    const answerForTheDay = answers.find(answer => isSameDay(day, answer.timestamp))
    if (!answerForTheDay) return UnansweredCell
    return answerForTheDay.response ? YesAnswerCell : NoAnswerCell
  })

const isPreviousDayOrBefore = (date1: Date, date2: Date): boolean => {
  const previousDate = new Date(date2)
  previousDate.setDate(date2.getDate() - 1)

  return isSameDay(date1, previousDate) || date1 < date2
}

const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
