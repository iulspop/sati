import type { Answer } from '~/self-data-collection/domain/entities/answer'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'

export type AnswersGroupedByQuestion = {
  question: RecurringQuestion
  answers: Answer[]
}

export type LastWeekAnswersTableComponentProps = {
  answersGroupedByQuestions: AnswersGroupedByQuestion[]
  currentDate: Date
  timezone?: string
}

export function LastWeekAnswersTableComponent({
  answersGroupedByQuestions,
  currentDate = new Date(),
  timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone,
}: LastWeekAnswersTableComponentProps) {
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
          <th aria-label="Empty header for spacing"></th>
          <th scope="column" abbr="September 25">
            09/25
          </th>
          <th scope="column">09/26</th>
          <th scope="column">09/27</th>
          <th scope="column">09/28</th>
          <th scope="column">09/29</th>
          <th scope="column">09/30</th>
          <th scope="column">10/01</th>
          <th scope="column">10/02</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Did you complete your morning 1h meditation?</th>
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UnansweredCell />
        </tr>
        <tr>
          <th scope="row">Did you complete your noon 1h meditation?</th>
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UnansweredCell />
        </tr>
        <tr>
          <th scope="row">Did you complete your evening 1h meditation?</th>
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UntrackedCell />
          <UnansweredCell />
        </tr>
      </tbody>
    </table>
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
