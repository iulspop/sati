import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import prisma from '~/prisma-client'

export const loader = async () => {
  return json(
    await prisma.recurringQuestion.findMany({
      include: {
        answers: true,
      },
    })
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
