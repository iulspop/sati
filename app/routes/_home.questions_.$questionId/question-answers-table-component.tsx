import type { Answer } from '~/self-data-collection/domain/entities/answer'

export type QuestionsAnswersTableComponentProps = {
  answers: Answer[]
  fixTimezone: (date: Date) => Date
}

export function QuestionsAnswersTableComponent({
  answers,
  fixTimezone = date => date,
}: QuestionsAnswersTableComponentProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        {answers
          .slice()
          .reverse()
          .map(answer => (
            <tr key={answer.id}>
              {/* en-GB formats date like this: dd/mm/yyyy */}
              <td>{new Intl.DateTimeFormat('en-GB').format(fixTimezone(answer.timestamp))}</td>
              <td>{answer.response ? 'True' : 'False'}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
