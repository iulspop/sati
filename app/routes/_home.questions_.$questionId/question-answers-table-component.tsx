import type { Answer } from '~/self-inquiry/domain/entities/answer'

export type QuestionsAnswersTableComponentProps = {
  answers: Answer[]
  fixTimezone?: (date: Date) => Date
}

export function QuestionsAnswersTableComponent({ answers, fixTimezone = date => date }: QuestionsAnswersTableComponentProps) {
  return (
    <div className="flex flex-col space-y-4 bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto dark:text-black mt-4">
      <h2 className="font-semibold text-lg">Question Answers</h2>
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
                <td className="border">{new Intl.DateTimeFormat('en-GB').format(fixTimezone(answer.timestamp))}</td>
                <td className="border">{answer.response ? 'True' : 'False'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
