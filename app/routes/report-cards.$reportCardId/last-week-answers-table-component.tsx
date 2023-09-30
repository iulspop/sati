import { createElement } from 'react'
import { z } from 'zod'
import { AnswerSchema, type Answer } from '~/self-inquiry/domain/entities/answer'
import { RecurringQuestionSchema } from '~/self-inquiry/domain/entities/recurring-question'

export const AnswersGroupedByQuestionSchema = z.object({
  question: RecurringQuestionSchema,
  answers: z.array(AnswerSchema),
})

export type AnswersGroupedByQuestion = z.infer<typeof AnswersGroupedByQuestionSchema>

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
    <table className="w-full max-w-screen-xl border-collapse m-6 bg-gray-800 text-gray-200">
      <caption style={{ captionSide: 'bottom' }} className="text-center text-gray-400 pt-4">
        Last 7 Days' Meditations
      </caption>
      <thead>
        <tr>
          <th scope="row">Days Since Start:</th>
          {notTrackedHeaderColSpan >= 1 && <NotTrackedColumnHeader colSpan={notTrackedHeaderColSpan} />}
          {daysSinceStartList.map(day => (
            <DaySinceStartCountColumnHeader key={day} day={day} />
          ))}
        </tr>
        <tr>
          <th scope="row">Date:</th>
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

const QuestionAnswersRow = ({ question, answers, questionsCreatedDate, currentDate }) => {
  const previousSevenDays = getPreviousSevenDays(currentDate)

  return (
    <tr>
      <th scope="row">{question.text}</th>
      {calculatePreviousSevenDaysAnswers(answers, questionsCreatedDate, currentDate).map((answerCell, index) =>
        createElement(answerCell, { key: previousSevenDays[index].toISOString() })
      )}
      <UnansweredCell />
    </tr>
  )
}

const NotTrackedColumnHeader = ({ colSpan }) => (
  <th scope="column" colSpan={colSpan} className="bg-gray-700 text-gray-500 p-2">
    Not Tracked
  </th>
)

const DaySinceStartCountColumnHeader = ({ day }) => (
  <th scope="column" className="p-2">
    {day}
  </th>
)

const DateColumnHeader = ({ text }) => (
  <th scope="column" className="p-2">
    {text}
  </th>
)

export const UntrackedCell = () => <td className="border p-2 bg-gray-700 text-gray-500" aria-label="Untracked data" />

export const YesAnswerCell = () => <td className="border p-2 bg-green-500" aria-label="Yes" />

export const NoAnswerCell = () => <td className="border p-2 bg-red-500" aria-label="No" />

export const UnansweredCell = () => (
  <td className="border p-2 bg-gray-500 text-center text-gray-400" aria-label="Unanswered">
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
export const calculatePreviousSevenDaysAnswers: CalculatePreviousSevenDaysAnswers = (answers, questionCreatedDate, currentDate) =>
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
  date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
