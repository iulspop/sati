import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserIsAuthenticated } from '~/routes/_auth/user-authentication-session.server'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'
import { recurringQuestionsService } from '~/self-data-collection/domain/index.server'
import type { DeleteQuestionFormEntries } from './edit-question-form-component'
import { EditQuestionFormComponent } from './edit-question-form-component'

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserIsAuthenticated(request)
  const pathSegments = new URL(request.url).pathname.split('/')
  const questionId = pathSegments[pathSegments.length - 1]
  const recurringQuestion = await recurringQuestionsService.read(questionId)
  return json(recurringQuestion)
}

export const action = async ({ request }: ActionArgs) => {
  await requireUserIsAuthenticated(request)
  const formData = await request.formData()
  // @ts-expect-error
  const deleteQuestionFormEntries: DeleteQuestionFormEntries = Object.fromEntries(formData.entries())
  await recurringQuestionsService.delete(deleteQuestionFormEntries.questionId)
  return redirect('/questions')
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Questions | Inquire' }]

export default function CreateQuestionPage() {
  const serializedRecurringQuestion = useLoaderData<typeof loader>()
  // @ts-expect-error
  const recurringQuestion: RecurringQuestion = {
    ...serializedRecurringQuestion,
    timestamp: new Date(serializedRecurringQuestion.timestamp),
  }

  return <EditQuestionFormComponent {...recurringQuestion} />
}
