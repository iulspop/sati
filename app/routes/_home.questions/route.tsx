import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { requireUserIsAuthenticated } from '~/routes/_auth/user-authentication-session.server'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'
import { RecurringQuestions } from '~/self-data-collection/domain/index.server'
import { QuestionListComponent } from './question-list-component'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserIsAuthenticated(request)
  const recurringQuestions = await RecurringQuestions.readAll(userId)
  return json(recurringQuestions)
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Questions | Inquire' }]

export default function QuestionsPage() {
  const recurringQuestions = useLoaderData<typeof loader>().map(serializedRecurringQuestion => ({
    ...serializedRecurringQuestion,
    phase: {
      timestamp: new Date(serializedRecurringQuestion.phase.timestamp),
      utcOffsetInMinutes: serializedRecurringQuestion.phase.utcOffsetInMinutes,
    },
  })) as RecurringQuestion[]

  return (
    <>
      <Link
        to="/questions/create"
        className="inline-block bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 self-end"
      >
        Add Question
      </Link>
      <QuestionListComponent questions={recurringQuestions} />
    </>
  )
}
