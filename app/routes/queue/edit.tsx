import { json, LoaderFunction } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { RecurringQuestions } from '~/domains/self-data-collection/domain'

export const loader: LoaderFunction = async () => {
  const recurringQuestions = await RecurringQuestions.readAll()
  return json(recurringQuestions)
}

export default function EditQuestions() {
  const recurringQuestions = useLoaderData<typeof loader>()
  console.log(recurringQuestions)

  return (
    <>
      <ol>
        {recurringQuestions.map(recurringQuestion => (
          <li key={recurringQuestion.id}>
            <Link to={recurringQuestion.id}>{recurringQuestion.question}</Link>
          </li>
        ))}
      </ol>
      <Link to={'add'}>Add a question</Link>
      <Outlet />
    </>
  )
}
