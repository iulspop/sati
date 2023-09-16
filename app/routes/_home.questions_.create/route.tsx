import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserIsAuthenticated } from '~/routes/_auth/user-authentication-session.server'
import { QuestionListComponent } from '~/routes/_home.questions/question-list-component'
import type {
  CreateRecurringQuestionCommand,
  RecurringQuestion,
} from '~/self-data-collection/domain/entities/recurring-question'
import { RecurringQuestions } from '~/self-data-collection/domain/index.server'
import type { CreateQuestionFormEntries } from './create-question-form-component'
import { CreateQuestionFormComponent } from './create-question-form-component'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserIsAuthenticated(request)
  const recurringQuestions = await RecurringQuestions.readAll(userId)
  return json(recurringQuestions)
}

export const action = async ({ request }) => {
  const userId = await requireUserIsAuthenticated(request)
  const formData = await request.formData()
  // @ts-expect-error
  const questionFormEntries: CreateQuestionFormEntries = Object.fromEntries(formData.entries())
  await RecurringQuestions.create(toCreateRecurringQuestionCommand(questionFormEntries, userId))
  return new Response(null, { status: 200 })
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Questions | Inquire' }]

export default function CreateQuestionPage() {
  const recurringQuestions = useLoaderData<typeof loader>().map(serializedRecurringQuestion => ({
    ...serializedRecurringQuestion,
    phase: {
      timestamp: new Date(serializedRecurringQuestion.phase.timestamp),
      utcOffsetInMinutes: serializedRecurringQuestion.phase.utcOffsetInMinutes,
    },
  })) as RecurringQuestion[]

  return (
    <>
      <CreateQuestionFormComponent />
      <QuestionListComponent questions={recurringQuestions} />
    </>
  )
}

type ToCreateRecurringQuestionCommand = (
  questionFormEntries: CreateQuestionFormEntries,
  userId: string
) => CreateRecurringQuestionCommand
export const toCreateRecurringQuestionCommand: ToCreateRecurringQuestionCommand = (
  { text, timestamp, utcOffsetInMinutes },
  userId
) => {
  return {
    userId,
    question: text,
    phase: {
      timestamp: new Date(timestamp),
      utcOffsetInMinutes: Number(utcOffsetInMinutes),
    },
  }
}
