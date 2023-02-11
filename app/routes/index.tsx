import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { answers as Answers, recurringQuestions as RecurringQuestions } from '~/domains/self-data-collection/domain'

export const loader = async () => {
  const [recurringQuestions, answers] = await Promise.all([RecurringQuestions.readAll(), Answers.readAll()])

  return json(
    recurringQuestions.map(recurringQuestion => ({
      ...recurringQuestion,
      answers: answers.filter(answer => answer.questionId === recurringQuestion.id),
    }))
  )
}

export default function Index() {
  const recurringQuestions = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>Remix + Prisma</h1>
      <ul>
        {recurringQuestions.map(({ id, question, answers }) => (
          <li key={id}>
            <h2>{question}</h2>
            <ul>
              {answers.map(({ id, timestamp, response }) => (
                <li key={id}>
                  {timestamp}: {String(response)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
