import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { RecurringQuestion } from '~/domains/self-data-collection/domain/entities/recurring-question'
import { RecurringQuestions } from '~/domains/self-data-collection/domain/index.server'
import { requireUserIsAuthenticated } from '~/routes/_auth/user-authentication-session.server'
import { QuestionListComponent } from './question-list-component'

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserIsAuthenticated(request)
  const recurringQuestions = await RecurringQuestions.readAll()
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

  return <QuestionListComponent questions={recurringQuestions} />
}
